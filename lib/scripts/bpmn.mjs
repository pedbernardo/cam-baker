import { resolveSourceConfig } from '../resolver.mjs'
import { deploy } from './deploy.mjs'

export function onBpmnChange ({ filepath, config }) {
  deploy({
    config,
    filepath
  })
}

export function onBpmnFormChange ({ filepath, config }) {
  const targets = resolveSourceConfig({ filepath, config })

  if (!targets || !targets.length) return

  const outputs = targets.map(({ output }) => output)

  deploy({
    config,
    incomingChanges: outputs
  })
}
