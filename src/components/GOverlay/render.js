function renderOverlay(h) {
  if (this.value) {
    return h('div', { class: 'g-overlay' })
  }
}

export default function(h) {
  return h(
    'transition',
    {
      props: { name: 'show-overlay' }
    },
    [ renderOverlay.call(this, h) ]
  )
}
