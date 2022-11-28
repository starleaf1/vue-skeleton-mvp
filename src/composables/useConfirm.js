import { getCurrentInstance } from 'vue'

export default () => {
  const vm = getCurrentInstance()
  return vm.proxy?.$confirm ?? undefined
}
