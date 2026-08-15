import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAudio } from "../context/AudioContext";
import Header from "../components/Header";
import { Colors, Spacing, FontSizes, BorderRadius } from "../constants/theme";
import { AppConfig, Banners } from "../constants/config";
import { fetchBlogPosts, BlogPost } from "../services/BlogService";
import {
  fetchHeroBanners,
  fetchSponsorBanners,
  BannerItem,
} from "../services/BannerService";
import { decode } from "html-entities";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { isPlaying, currentStream, currentShow } = useAudio();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [heroBanners, setHeroBanners] = useState<BannerItem[]>([]);
  const [sponsorBanners, setSponsorBanners] = useState<BannerItem[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);
  const heroTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sponsorTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch blog posts
  useEffect(() => {
    fetchBlogPosts(5).then((posts) => {
      if (posts.length > 0) {
        setBlogPosts(posts);
      }
    });
  }, []);

  // Fetch banners
  useEffect(() => {
    fetchHeroBanners().then((banners) => {
      if (banners.length > 0) setHeroBanners(banners);
    });
    fetchSponsorBanners().then((banners) => {
      if (banners.length > 0) setSponsorBanners(banners);
    });
  }, []);

  // Rotate hero banners
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    heroTimerRef.current = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroBanners.length);
    }, Banners.rotationInterval);
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, [heroBanners.length]);

  // Rotate sponsor banners
  useEffect(() => {
    if (sponsorBanners.length <= 1) return;
    sponsorTimerRef.current = setInterval(() => {
      setCurrentSponsorIndex((prev) => (prev + 1) % sponsorBanners.length);
    }, Banners.rotationInterval);
    return () => {
      if (sponsorTimerRef.current) clearInterval(sponsorTimerRef.current);
    };
  }, [sponsorBanners.length]);

  const handleBannerPress = (banner: BannerItem) => {
    // Only open URLs that start with https:// for security
    if (banner.linkUrl && banner.linkUrl.startsWith("https://")) {
      Linking.openURL(banner.linkUrl);
    }
  };

  const handleBlogPress = (link: string) => {
    // Same https-only rule as banners
    if (link && link.startsWith("https://")) {
      Linking.openURL(link);
    }
  };

  const currentHeroBanner = heroBanners[currentHeroIndex];
  const currentSponsorBanner = sponsorBanners[currentSponsorIndex];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header />

      <TouchableOpacity
        style={styles.listenContainer}
        onPress={() => navigation.navigate("Player")}
      >
        {isPlaying ? (
          <>
            <View style={styles.listenIcon}>
              <Text style={styles.listenIconText}>JP2</Text>
            </View>
            <View style={styles.listenInfo}>
              <Text style={styles.listenLabel}>
                {currentStream.frequency} · LIVE
              </Text>
              <Text style={styles.listenTitle} numberOfLines={1}>
                {currentShow}
              </Text>
            </View>
            <View style={styles.playButton}>
              <Ionicons name="pause" size={20} color={Colors.white} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.playButtonLarge}>
              <Ionicons name="play" size={24} color={Colors.white} />
            </View>
            <View style={styles.listenInfo}>
              <Text style={styles.listenTitle}>Listen Live</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255,255,255,0.6)"
            />
          </>
        )}
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        {currentHeroBanner ? (
          <TouchableOpacity
            style={styles.heroBanner}
            onPress={() => handleBannerPress(currentHeroBanner)}
            activeOpacity={currentHeroBanner.linkUrl ? 0.8 : 1}
          >
            <Image
              source={{ uri: currentHeroBanner.imageUrl }}
              style={styles.heroBannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.heroBannerFallback}>
            <View style={styles.heroLogoBox}>
              <Text style={styles.heroLogoText}>JP2</Text>
            </View>
            <Text style={styles.heroTitle}>JP2 RADIO</Text>
            <Text style={styles.heroTagline}>
              {AppConfig.tagline.toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>LATEST</Text>
        {blogPosts.map((post, index) => (
          <TouchableOpacity
            key={post.id || index}
            style={styles.blogCard}
            onPress={() => handleBlogPress(post.link)}
          >
            {post.imageUrl ? (
              <Image
                source={{ uri: post.imageUrl }}
                style={styles.blogImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.blogImagePlaceholder} />
            )}
            <View style={styles.blogContent}>
              <Text style={styles.blogTitle} numberOfLines={2}>
                {decode(post.title)}
              </Text>
              <Text style={styles.blogDate}>{post.pubDate}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Sponsor Banner */}
        {currentSponsorBanner ? (
          <TouchableOpacity
            style={styles.sponsorBanner}
            onPress={() => handleBannerPress(currentSponsorBanner)}
            activeOpacity={currentSponsorBanner.linkUrl ? 0.8 : 1}
          >
            <Image
              source={{ uri: currentSponsorBanner.imageUrl }}
              style={styles.sponsorBannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.sponsorBannerFallback}>
            <Text style={styles.sponsorText}>Sponsor Banner</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listenContainer: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  listenIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  listenIconText: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  listenInfo: { flex: 1 },
  listenLabel: { color: "rgba(255,255,255,0.7)", fontSize: FontSizes.xs },
  listenTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  playButton: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonLarge: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1 },
  heroBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  heroBannerImage: { width: "100%", aspectRatio: 1080 / 540 },
  heroBannerFallback: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.xxl,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  heroLogoBox: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  heroLogoText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  heroTitle: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroTagline: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  blogCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    overflow: "hidden",
  },
  blogImage: { width: 80, height: 70 },
  blogImagePlaceholder: {
    width: 80,
    height: 70,
    backgroundColor: Colors.border,
  },
  blogContent: { flex: 1, padding: Spacing.md, justifyContent: "center" },
  blogTitle: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: "600",
    lineHeight: 18,
    marginBottom: 4,
  },
  blogDate: { color: Colors.textSecondary, fontSize: FontSizes.xs },
  sponsorBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  sponsorBannerImage: { width: "100%", aspectRatio: 1080 / 270 },
  sponsorBannerFallback: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    height: 60,
    backgroundColor: "#2d5016",
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  sponsorText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
});
