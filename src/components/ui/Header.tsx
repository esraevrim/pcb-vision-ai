import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Shield, User } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Badge } from './Badge';
import { APP_CONFIG } from '../../constants/config';

interface HeaderProps {
  alertCount?: number;
  subtitle?: string;
}

export const Header = ({ alertCount = 2, subtitle }: HeaderProps) => (
  <SafeAreaView edges={['top']} style={styles.safeArea}>
    <View style={styles.container}>
      {/* Logo + Title */}
      <View style={styles.titleRow}>
        <View style={styles.logoCircle}>
          <Shield size={18} color={Colors.accent} />
        </View>
        <View>
          <Text style={styles.title}>{APP_CONFIG.appName}</Text>
          <Text style={styles.subtitle}>{subtitle ?? APP_CONFIG.facility}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Bell size={20} color={Colors.textSecondary} />
          {alertCount > 0 && (
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{alertCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, styles.avatarBtn]} activeOpacity={0.7}>
          <User size={18} color={Colors.accent} />
        </TouchableOpacity>
      </View>
    </View>

    {/* System status strip */}
    <View style={styles.statusStrip}>
      <Badge label="MODEL ACTIVE" color={Colors.success} dot />
      <View style={styles.stripDivider} />
      <Badge label={APP_CONFIG.modelName} color={Colors.accent} size="sm" />
      <View style={styles.stripDivider} />
      <Badge label={APP_CONFIG.productionLine} color={Colors.textSecondary} size="sm" />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: `${Colors.accent}44`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBtn: { backgroundColor: Colors.accentGlow, borderColor: `${Colors.accent}44` },
  alertBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.bgSurface,
  },
  alertBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  statusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  stripDivider: { width: 1, height: 12, backgroundColor: Colors.border },
});
