import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { Audio } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getPodcastChannels } from '../services/podcastService';
import { fetchContent } from '../services/contentService';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [channels, setChannels] = useState([]);
    const [trendingContent, setTrendingContent] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPlaying, setCurrentPlaying] = useState(null);
    const [currentEQPreset, setCurrentEQPreset] = useState(0);
    const [eqApplied, setEqApplied] = useState(false);
    const flatListRef = useRef();
    const audioRef = useRef(new Audio.Sound());
    const youtubePlayerRef = useRef(null);
    const playbackTimerRef = useRef(null);
    const animationRef = useRef(new Animated.Value(0)).current;

    const rssUrls = [
        'https://feed.firstory.me/rss/user/ckudnw7fn4tqg0870axzgirva',
        'https://feed.firstory.me/rss/user/ckkhn2rmtod2m0831n3otw34x',
        // ... (保留其他 RSS URLs)
    ];

    useEffect(() => {
        fetchPodcastChannels();
        fetchTrendingContent();
        fetchCategories();

        return () => {
            if (audioRef.current) {
                audioRef.current.unloadAsync();
            }
            if (playbackTimerRef.current) {
                clearTimeout(playbackTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (currentPlaying) {
            Animated.loop(
                Animated.timing(animationRef, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            animationRef.setValue(0);
        }
    }, [currentPlaying]);

    const fetchPodcastChannels = async () => {
        const fetchedChannels = await getPodcastChannels(rssUrls);
        setChannels(fetchedChannels);
    };

    const fetchTrendingContent = async () => {
        const contentData = await fetchContent();
        setTrendingContent(contentData);
    };

    const fetchCategories = async () => {
        const cats = ['音樂', '喜劇', '真實犯罪', '科技', '生活方式'];
        setCategories(cats);
    };

    const applyEQPreset = async (presetIndex) => {
        const preset = EQControl.EQ_PRESETS[presetIndex].values;
        try {
            if (audioRef.current) {
                await audioRef.current.setEqualizer({
                    bands: preset.map((value, index) => ({
                        frequency: 60 * Math.pow(2, index),
                        gain: value
                    }))
                });
                setEqApplied(true);
            }
            if (youtubePlayerRef.current) {
                applyEQToYouTube(youtubePlayerRef.current, preset);
                setEqApplied(true);
            }
        } catch (error) {
            console.error('Error applying EQ:', error);
            setEqApplied(false);
        }
    };

    const playAudio = async (item) => {
        try {
            await audioRef.current.unloadAsync();
            if (item.type === 'podcast') {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: item.audioUrl },
                    { shouldPlay: true }
                );
                audioRef.current = sound;
                await applyEQPreset(currentEQPreset);
                await sound.playAsync();
            } else if (item.type === 'youtube') {
                // YouTube playback is handled by YoutubePlayer component
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const handleContentPress = async (item) => {
        setCurrentPlaying(item);
        await playAudio(item);
    };

    const renderTrendingItem = ({ item }) => (
        <TouchableOpacity
            style={styles.trendingItem}
            onPress={() => handleContentPress(item)}
        >
            <Image
                source={{ uri: item.type === 'youtube' ? `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg` : item.imageUrl }}
                style={styles.trendingImage}
            />
            <View style={styles.trendingInfo}>
                <Text style={styles.trendingTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.trendingChannel}>{item.channelTitle}</Text>
                {item.type === 'youtube' && (
                    <FontAwesome5 name="youtube" size={24} color="#FF0000" style={styles.youtubeIcon} />
                )}
            </View>
            {currentPlaying && currentPlaying.id === item.id && (
                <Animated.View style={[styles.playAnimation, {
                    transform: [{
                        rotate: animationRef.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                        }),
                    }],
                }]}>
                    <FontAwesome5 name="play-circle" size={30} color="#1DB954" />
                </Animated.View>
            )}
        </TouchableOpacity>
    );

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate('CategoryDetail', { category: item })}
        >
            <Text style={styles.categoryTitle}>{item}</Text>
        </TouchableOpacity>
    );

    const renderChannelItem = ({ item }) => (
        <TouchableOpacity
            style={styles.channelItem}
            onPress={() => navigation.navigate('PodcastDetail', { channel: item })}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.channelImage} />
            <Text style={styles.channelTitle} numberOfLines={2}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>探索</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                    <Feather name="search" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <FlatList
                ListHeaderComponent={
                    <>
                        <Text style={styles.sectionTitle}>熱門趨勢</Text>
                        <FlatList
                            data={trendingContent}
                            renderItem={renderTrendingItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.trendingList}
                        />

                        <Text style={styles.sectionTitle}>探索類別</Text>
                        <FlatList
                            data={categories}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesList}
                        />

                        <Text style={styles.sectionTitle}>熱門播客</Text>

                        <View style={styles.newFeatureContainer}>
                            <Text style={styles.newFeatureTitle}>每日推薦</Text>
                            {/* 在這裡添加每日推薦的內容 */}
                        </View>

                        <View style={styles.newFeatureContainer}>
                            <Text style={styles.newFeatureTitle}>新上線節目</Text>
                            {/* 在這裡添加新上線節目的內容 */}
                        </View>
                    </>
                }
                data={channels}
                renderItem={renderChannelItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={styles.channelColumnWrapper}
            />

            {currentPlaying && currentPlaying.type === 'youtube' && (
                <YoutubePlayer
                    ref={youtubePlayerRef}
                    height={0}
                    play={true}
                    videoId={currentPlaying.videoId}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000',
        marginTop: 30,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    trendingList: {
        paddingLeft: 20,
    },
    trendingItem: {
        width: width * 0.8,
        marginRight: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#F0F0F0',
    },
    trendingImage: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    trendingInfo: {
        padding: 10,
    },
    trendingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 5,
    },
    trendingChannel: {
        fontSize: 14,
        color: '#666',
    },
    youtubeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    playAnimation: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    categoriesList: {
        paddingLeft: 20,
    },
    categoryItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        marginRight: 10,
    },
    categoryTitle: {
        fontSize: 16,
        color: '#000',
    },
    channelColumnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    channelItem: {
        width: '48%',
        marginBottom: 20,
    },
    channelImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        marginBottom: 10,
    },
    channelTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F0F0F0',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    eqStatusText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    newFeatureContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        margin: 20,
        padding: 15,
    },
    newFeatureTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
    },
});

export default HomeScreen;
