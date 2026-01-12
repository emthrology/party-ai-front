/**
 * 네비게이션 관련 타입 정의
 */

export interface MenuItem {
  to: string
  icon: string
  label: string
}

export interface SidebarNavItemProps {
  to: string
  icon: string
  label: string
  isActive: boolean
}

