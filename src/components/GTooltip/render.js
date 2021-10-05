export default function(h) {
  return h(
    'div',
    {
      attrs: {
        id: 'g-tooltip',
        'data-popper-reference-hidden': ''
      },
      class: 'g-tooltip'
    }
  )
}
