import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ToastAndroid, BackHandler } from 'react-native';
import { Camera, useCameraPermissions, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import CircleButton from '../components/CircleButton';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RadioGroup from '../components/RadioGroup';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function CameraScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();

    const [facing, setFacing] = useState('back');
    const [cameraReady, setCameraReady] = useState(false);
    const cameraRef = useRef(null);

    const [currentRatio, setCurrentRatio] = useState('1:1');
    const [pictureSize, setPictureSize] = useState('4000x3000');
    const [torchEnabled, setTorchEnabled] = useState(false);
    const [zoom, setZoom] = useState(0);

    const ratioOptions = ['4:3', '16:9', '1:1'];
    const sizeOptions = [
        '640x480', '800x600', '1024x768', '1280x960',
        '1400x1050', '1600x1200', '1920x1440', '2048x1536',
        '2560x1920', '3200x2400', '4000x3000'
    ];
    const torchOptions = [false, true];
    const zoomOptions = [0, 0.5, 1, 1.5, 2];

    const bottomSheetRef = useRef(null);
    const snapPoints = ['20%', '50%', '90%'];

    const handleOpenBottomSheet = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);

    const handleCloseBottomSheet = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('black');
    }, []);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        } else if (permission?.granted) {
            setCameraReady(true);
        }
    }, [permission]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });
        return () => backHandler.remove();
    }, [navigation]);

    const flipCamera = () => {
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    const goToMaps = () => {
        navigation.navigate('MapScreen');
    };

    const takePicture = async () => {
        if (cameraRef.current && cameraReady) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                const mediaAsset = await MediaLibrary.createAssetAsync(photo.uri);

                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    ToastAndroid.show("No access to the location!", ToastAndroid.SHORT);
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                const newPhoto = {
                    id: Date.now().toString(),
                    uri: photo.uri,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    timestamp: Date.now()
                };

                const storedPhotos = await AsyncStorage.getItem('photos');
                const photoArray = storedPhotos ? JSON.parse(storedPhotos) : [];

                photoArray.push(newPhoto);
                await AsyncStorage.setItem('photos', JSON.stringify(photoArray));

                ToastAndroid.showWithGravity(
                    'The photo has been saved!',
                    ToastAndroid.SHORT,
                    ToastAndroid.TOP
                );
            } catch (error) {
                ToastAndroid.showWithGravity(
                    'Error while taking the photo!',
                    ToastAndroid.SHORT,
                    ToastAndroid.TOP
                );
            }
        }
    };

    const changeRatio = (newRatio) => setCurrentRatio(newRatio);
    const changePictureSize = (newSize) => setPictureSize(newSize);
    const changeTorchEnabled = (value) => setTorchEnabled(value);
    const changeZoom = (value) => setZoom(value);

    if (!permission) {
        return (
            <View style={styles.center}>
                <Text>Brak uprawnień do kamery</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.flexOne}>
            <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.container}>
                {cameraReady && (
                    <CameraView
                        style={styles.cameraStyle}
                        ref={cameraRef}
                        facing={facing}
                        onCameraReady={() => setCameraReady(true)}
                        ratio={currentRatio}
                        pictureSize={pictureSize}
                        enableTorch={torchEnabled}
                        zoom={zoom}
                    >
                        <View style={styles.mapBtn}>
                            <CircleButton btnwidth={"60"} btnheight={"60"} iconSize={28} iconName="map-outline" onPress={goToMaps} />
                        </View>
                        <View style={styles.controls}>
                            <CircleButton btnwidth={"60"} btnheight={"60"} iconSize={28} iconName="camera-reverse-outline" onPress={flipCamera} />
                            <CircleButton btnwidth={"90"} btnheight={"90"} iconSize={56} iconName="camera-outline" onPress={takePicture} />
                            <CircleButton btnwidth={"60"} btnheight={"60"} iconSize={28} iconName="ellipsis-horizontal-outline" onPress={handleOpenBottomSheet} />
                        </View>
                    </CameraView>
                )}
            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1} // początkowo zamknięty
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                handleComponent={() => (
                    <View style={styles.handleBarContainer}>
                        <View style={styles.handleBar} />
                    </View>
                )}
            >
                <BottomSheetView style={styles.bottomSheetContainer}>
                    <Text style={styles.header}>TORCH MODE</Text>
                    <RadioGroup
                        color="#3A8C5D"
                        data={torchOptions}
                        groupName=""
                        columns={2}
                        initialValue={false}
                        changeRadioGroup={changeTorchEnabled}
                    />

                    <Text style={styles.header}>CAMERA ZOOM</Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={2}
                        step={0.1}
                        value={zoom}
                        onValueChange={(value) => setZoom(value)}
                        minimumTrackTintColor="#3A8C5D"
                        maximumTrackTintColor="#fff"
                        thumbTintColor="#3A8C5D"
                    />
                    <Text style={styles.zoomValue}>{zoom.toFixed(1)}x</Text>

                    <Text style={styles.header}>CAMERA RATIO</Text>
                    <RadioGroup
                        color="#3A8C5D"
                        data={ratioOptions}
                        groupName=""
                        columns={3}
                        initialValue={"1:1"}
                        changeRadioGroup={changeRatio}
                    />

                    <Text style={styles.header}>PICTURE SIZES</Text>
                    <RadioGroup
                        color="#3A8C5D"
                        data={sizeOptions}
                        groupName=""
                        columns={2}
                        initialValue={"4000x3000"}
                        changeRadioGroup={changePictureSize}
                    />
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    flexOne: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    cameraStyle: {
        flex: 1,
    },
    mapBtn: {
        position: 'absolute',
        top: 50,
        left: "80%",
        width: '100%',
    },
    controls: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSheetContainer: {
        flex: 1,
        backgroundColor: '#080A0D',
        padding: 16,
    },
    header: {
        color: '#41A66C',
        fontSize: 16,
        marginVertical: 8,
        fontWeight: 'bold',
    },
    zoomValue: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 5,
    },
    handleBarContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#41A66C',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    handleBar: {
        width: 50,
        height: 5,
        backgroundColor: '#080A0D',
        borderRadius: 10,
    },
});
