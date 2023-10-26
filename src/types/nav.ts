export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

export interface SelectOptions {
  label: string | null
  value: string
}
