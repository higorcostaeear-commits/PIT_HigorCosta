import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Layout = {
  theme: string
  drawerOpen: boolean
}

const initialState: Layout = {
  theme: 'dark',
  drawerOpen: false,
}

export const layoutStore = create<Layout>()(
  persist(() => initialState, {
    name: 'layoutStore',
  })
)

export default function useLayoutService() {
  const { theme, drawerOpen } = layoutStore()
  return {
    theme,
    drawerOpen,
    toggleDrawer: () => {
      layoutStore.setState({
        drawerOpen: !drawerOpen,
      })
    },
  }
}
