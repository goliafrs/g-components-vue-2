import { isEmpty, classMerger } from '../../utils'

const name = 'g-table'

function renderCaption(h) {
  if (this.caption) {
    return h(
      'caption',
      {
        class: '${name}__caption'
      },
      this.caption
    )
  }
}

function renderColgroup(h) {
  if (this.hasCols) {
    return h(
      'colgroup',
      {
        class: `${name}__colgroup`
      },
      this.cols.map((col, index) => {
        return this.$scopedSlots.col ? this.$scopedSlots.col({
          col,
          index
        }) : this.$slots.col
      })
    )
  }
}

function renderHeader(h, header) {
  if (header) {
    const { value, title, sortable, align, width } = header
    return h(
      'th',
      {
        class: classMerger(
          {
            [`${name}__head-cell`]: true,
            [`${name}__head-cell--${align || 'center'}`]: true
          },
          header.class
        )
      },
      [
        h(
          'span',
          {
            class: {
              [`${name}__head-cell-title`]: true,
              [`${name}__head-cell-title--sort`]: sortable,
              [`${name}__head-cell-title--sort-desc`]: sortable && !isEmpty(this.proxy[value]) && !!~[ 'desc', 'DESC', '-1', -1 ].indexOf(this.proxy[value]),
              [`${name}__head-cell-title--sort-active`]: sortable && !isEmpty(this.proxy[value])
            },
            style: { 'min-width': typeof width === 'string' ? width : width || 0 + 'px' },
            domProps: { innerHTML: title },
            on: {
              click: () => {
                this.sorting(value, sortable)
              }
            }
          }
        )
      ]
    )
  }
}

function renderHead(h) {
  if (this.hasHead) {
    return h(
      'thead',
      {
        class: `${name}__head`
      },
      [
        h(
          'tr',
          {
            class: `${name}__head-row`
          },
          this.headers.map((header, index) => {
            return this.$scopedSlots.header ? this.$scopedSlots.header({
              header,
              index
            }) : this.$slots.header || renderHeader.call(this, h, header)
          })
        )
      ]
    )
  }
}

function renderBody(h) {
  if (this.hasBody) {
    return h(
      'tbody',
      {
        class: `${name}__body`
      },
      this.computedItems.map((item, index) => {
        return this.$scopedSlots.items ? this.$scopedSlots.items({
          item,
          index
        }) : this.$slots.items
      })
    )
  } else {
    return h(
      'div',
      {
        class: `${name}__empty`
      },
      [ this.$slots.empty || h('g-empty', { props: { value: this.noDataText } }) ]
    )
  }
}

function renderFoot(h) {
  if (this.hasFoot) {
    return h(
      'tfoot',
      {
        class: `${name}__foot`
      },
      [
        h(
          'tr',
          {
            class: `${name}__foot-row`
          },
          [ this.$slots.foot ]
        )
      ]
    )
  }
}

function renderLoading(h) {
  if (this.loading) {
    return h(
      'g-progress',
      {
        style: {
          position: 'absolute',
          top: 0,
          left: 0
        },
        props: {
          type: 'linear',
          indeterminate: true
        }
      }
    )
  }
}

export default function render(h) {
  return h(
    'table',
    {
      class: {
        [`${name}`]: true,
        [`${name}--dense`]: this.dense,
        [`${name}--tiny`]: this.tiny
      }
    },
    [
      renderCaption.call(this, h),

      renderColgroup.call(this, h),

      renderHead.call(this, h),
      renderBody.call(this, h),
      renderFoot.call(this, h),

      renderLoading.call(this, h)
    ]
  )
}
