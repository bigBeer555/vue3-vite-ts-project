import mitt from 'mitt'
import { EVENTS } from '../common/event'

const emitter = mitt()

export const eventBus = {
  openPreview(isShow: boolean) {
    emitter.emit(EVENTS.OPEN_PREVIEW, isShow)
  },
  onOpenPreview(callback: (isShow: boolean) => void) {
    emitter.on(EVENTS.OPEN_PREVIEW, callback)
  },
  closePreview(isShow: boolean) {
    emitter.emit(EVENTS.CLOSE_PREVIEW, isShow)
  }
}
