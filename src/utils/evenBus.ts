import mitt from 'mitt'
import { EVENTS } from '../common/event'

type EventMap = {
  [EVENTS.OPEN_PREVIEW]: boolean
  [EVENTS.CLOSE_PREVIEW]: boolean
}

const emitter = mitt<EventMap>()

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
