import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { Camera, FileSearch, BarChart2, Zap, Activity, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Header } from '../components/ui/Header';
import { NavigationCard } from '../components/dashboard/NavigationCard';
import { Badge } from '../components/ui/Badge';
import type { DashboardScreenProps } from '../navigation/types';

// Animated entry for each card
const AnimatedCard = ({ children, delay }: { children: React.ReactNode; delay: number }) => {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 18 }));
  }, [delay, opacity, translateY]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const headerOpacity = useSharedValue(0);
  useEffect(() => { headerOpacity.value = withTiming(1, { duration: 500 }); }, [headerOpacity]);
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgSurface} />

      {/* App Header */}
      <Animated.View style={headerStyle}>
        <Header alertCount={2} />
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner */}
        <AnimatedCard delay={0}>
          <LinearGradient
            colors={['#0D1F3D', '#060B14']}
            style={styles.heroBanner}
          >
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>PRODUCTION STATUS</Text>
              <Text style={styles.heroTitle}>System Operational</Text>
              <Text style={styles.heroSubtitle}>All subsystems running — YOLOv12 active</Text>
              <View style={styles.heroBadges}>
                <Badge label="96.4% ACCURACY" color={Colors.success} dot />
                <Badge label="28/HR" color={Colors.accent} />
              </View>
            </View>
            <View style={styles.heroRight}>
              <View style={styles.heroIconRing}>
                <Shield size={28} color={Colors.accent} />
              </View>
            </View>
          </LinearGradient>
        </AnimatedCard>

        {/* Section label */}
        <Text style={styles.sectionLabel}>QUICK ACCESS</Text>

        {/* Navigation Card 1 — Live Detection */}
        <AnimatedCard delay={80}>
          <NavigationCard
            title="Live Detection"
            description="Monitor PCB production line in real-time with continuous YOLO defect scanning and instant alerts"
            icon={<Camera size={22} color={Colors.accent} />}
            accentColor={Colors.accent}
            statusLabel="STREAM READY"
            statusType="online"
            badge="REAL-TIME"
            badgeColor={Colors.success}
            metric={{ label: 'Today', value: '147' }}
            onPress={() => navigation.navigate('Live')}
          />
        </AnimatedCard>

        {/* Navigation Card 2 — Manual Detection */}
        <AnimatedCard delay={160}>
          <NavigationCard
            title="Manual Inspection"
            description="Upload or capture PCB images for on-demand AI defect analysis with detailed result reports"
            icon={<FileSearch size={22} color={Colors.warning} />}
            accentColor={Colors.warning}
            statusLabel="MODEL READY"
            statusType="online"
            badge="ON-DEMAND"
            metric={{ label: 'Analyzed', value: '32' }}
            onPress={() => navigation.navigate('Manual')}
          />
        </AnimatedCard>

        {/* Navigation Card 3 — Statistics */}
        <AnimatedCard delay={240}>
          <NavigationCard
            title="Analytics & Reports"
            description="View production analytics, defect trends, KPI metrics, and weekly performance dashboards"
            icon={<BarChart2 size={22} color={Colors.purple} />}
            accentColor={Colors.purple}
            statusLabel="UP TO DATE"
            statusType="online"
            badge="7-DAY VIEW"
            metric={{ label: 'Defect rate', value: '12.2%' }}
            onPress={() => navigation.navigate('Statistics')}
          />
        </AnimatedCard>

        {/* Bottom stats strip */}
        <AnimatedCard delay={320}>
          <View style={styles.statsStrip}>
            <StatCell icon={<Zap size={14} color={Colors.accent} />} label="Detections" value="18,241" color={Colors.accent} />
            <View style={styles.stripDivider} />
            <StatCell icon={<Activity size={14} color={Colors.success} />} label="Pass Rate" value="87.8%" color={Colors.success} />
            <View style={styles.stripDivider} />
            <StatCell icon={<Shield size={14} color={Colors.warning} />} label="Uptime" value="99.2%" color={Colors.warning} />
          </View>
        </AnimatedCard>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const StatCell = ({
  icon, label, value, color,
}: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <View style={styles.statCell}>
    {icon}
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  scroll: { flex: 1 },
  content: { gap: 12, padding: 16 },
  heroBanner: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: { flex: 1 },
  heroLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  heroSubtitle: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12, lineHeight: 17 },
  heroBadges: { flexDirection: 'row', gap: 8 },
  heroRight: { paddingLeft: 16 },
  heroIconRing: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1.5,
    borderColor: `${Colors.accent}55`,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: -4,
  },
  statsStrip: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  statCell: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 16, fontWeight: '800' },
  statLabel: { fontSize: 10, color: Colors.textMuted },
  stripDivider: { width: 1, height: 30, backgroundColor: Colors.border },
  bottomPad: { height: 16 },
});
