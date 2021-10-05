const today = new Date()
today.setHours(0, 0, 0, 0)

function renderTitle(h) {
  return h(
    'div',
    {
      class: 'g-date-picker__title'
    },
    [
      h(
        'span',
        {
          class: 'g-date-picker__title-item g-date-picker__title-item--day',
          on: {
            click: () => {
              this.state = 'days'
            }
          }
        },
        new Date(this.computedDate.date).toLocaleString(this.localeTag, { day: 'numeric' })
      ),

      h(
        'span',
        {
          class: 'g-date-picker__title-item g-date-picker__title-item--month',
          on: {
            click: () => {
              this.state = 'months'
            }
          }
        },
        new Date(this.computedDate.date).toLocaleString(this.localeTag, { month: 'long' })
      ),

      h(
        'span',
        {
          class: 'g-date-picker__title-item g-date-picker__title-item--year',
          on: {
            click: () => {
              this.state = 'years'
            }
          }
        },
        this.computedDate.year
      )
    ]
  )
}

function renderArrow(h, direction = -1) {
  return h(
    'g-button',
    {
      class: 'ma-0',
      props: {
        icon: direction < 0 ? 'keyboard_arrow_left' : 'keyboard_arrow_right',
        flat: true
      },
      on: {
        click: () => {
          if (direction < 0) {
            switch (this.state) {
              case 'years':
                this.date.year--
                break
              case 'months':
              case 'days':
              default:
                this.date.month--
                this.date.day = 1
                break
            }
          }
          if (direction > 0) {
            switch (this.state) {
              case 'years':
                this.date.year++
                break
              case 'months':
              case 'days':
              default:
                this.date.month++
                this.date.day = 1
                break
            }
          }
        }
      }
    }
  )
}

function renderHeader(h) {
  return h(
    'div',
    {
      class: 'g-date-picker__header'
    },
    [ renderArrow.call(this, h), renderTitle.call(this, h), renderArrow.call(this, h, 1) ]
  )
}

function renderDay(h, day) {
  const currentDay = today.getTime()
  const uTime = this.getUnixTimeByDay(day)

  const { isActiveDate, isLeftActiveEdge, isRightActiveEdge } = this.isActiveDay(uTime)

  const isActive = isActiveDate || isLeftActiveEdge || isRightActiveEdge || uTime === currentDay || false

  if (day) {
    return h(
      'g-button',
      {
        class: 'g-date-picker__matrix-day',
        props: {
          label: day,
          flat: !isActive,
          round: true,
          depressed: isActive,
          outline: uTime === currentDay && !isActiveDate,
          color: isActive ? 'primary' : 'transparent',
          disabled: this.isDisabledDay(uTime)
        },
        on: {
          click: () => {
            this.pickDateHandler(day)
          },
          mouseover: () => {
            this.hoveringDate = this.getUnixTimeByDay(day)
          },
          mouseout: () => {
            this.hoveringDate = undefined
          }
        },
        key: `g-date-picker-day-${day}`
      }
    )
  }
}

function renderDays(h) {
  if (this.state === 'days') {
    return h(
      'div',
      {
        class: 'g-date-picker__holder'
      },
      [
        h(
          'table',
          {
            class: 'g-date-picker__matrix'
          },
          [
            h(
              'colgroup',
              {},
              this.daysOfWeek.map(day => {
                return h('col', { class: `g-date-picker__matrix-col g-date-picker__matrix-col--${day}` })
              })
            ),
            h(
              'thead',
              {},
              [
                h(
                  'tr',
                  {},
                  this.daysOfWeek.map(day => {
                    return h('th', { class: 'g-date-picker__matrix-day-of-week' }, day)
                  })
                )
              ]
            ),

            h(
              'tbody',
              {},
              this.computedDate.daysMatrix.map(week => {
                return h(
                  'tr',
                  {
                    class: 'g-date-picker__matrix-row'
                  },
                  week.map(day => {
                    const uTime = this.getUnixTimeByDay(day)

                    const { isInRange, isLeftActiveEdge, isRightActiveEdge } = this.isActiveDay(uTime)

                    let isLeftActiveHoverDate = false
                    let isRightActiveHoverDate = false

                    const arrTimeForHover = []

                    if (this.hoveringDate) {
                      arrTimeForHover.push(this.convertDate(this.proxy[0]))
                      arrTimeForHover.push(this.hoveringDate)
                    }

                    arrTimeForHover.sort()

                    if (arrTimeForHover.length === 2 && this.proxy.length === 1) {
                      if (uTime === arrTimeForHover[0]) {
                        isLeftActiveHoverDate = true
                      }
                      if (uTime === arrTimeForHover[1]) {
                        isRightActiveHoverDate = true
                      }
                    }

                    return h(
                      'td',
                      {
                        class: {
                          'g-date-picker__matrix-day-cell': true,
                          'g-date-picker__matrix-day-cell--active': day && isInRange,
                          'g-date-picker__matrix-day-cell--active-left': day && isLeftActiveEdge,
                          'g-date-picker__matrix-day-cell--active-right': day && isRightActiveEdge,
                          'g-date-picker__matrix-day-cell--active-hover': day && this.isActiveHoverDay(uTime) && this.range,
                          'g-date-picker__matrix-day-cell--active-hover-left': day && isLeftActiveHoverDate && !isLeftActiveEdge && this.range,
                          'g-date-picker__matrix-day-cell--active-hover-right': day && isRightActiveHoverDate && !isRightActiveEdge && this.range
                        }
                      },
                      [ renderDay.call(this, h, day) ]
                    )
                  })
                )
              })
            )
          ]
        )
      ]
    )
  }
}

function renderMonths(h) {
  if (this.state === 'months') {
    return h(
      'div',
      {
        class: 'g-date-picker__holder'
      },
      [
        h(
          'table',
          {
            class: 'g-date-picker__matrix'
          },
          [
            h(
              'tbody',
              {},
              this.computedDate.monthsMatrix.map(quarter => {
                return h(
                  'tr',
                  {},
                  quarter.map(month => {
                    const outline = today.getFullYear() === this.date.year && today.getMonth() === month.number && !this.isActiveMonth(this.date.year, month.number)
                    const color = this.isActiveMonth(this.date.year, month.number) || (today.getFullYear() === this.date.year && today.getMonth() === month.number) ? 'primary' : undefined
                    return h(
                      'td',
                      {
                        class: 'g-date-picker__matrix-month-cell'
                      },
                      [
                        h(
                          'g-button',
                          {
                            class: 'g-date-picker__matrix-month',
                            props: {
                              label: month.short,
                              flat: !this.isActiveMonth(this.date.year, month.number),
                              rounded: true,
                              block: true,
                              depressed: true,
                              color,
                              outline
                            },
                            on: {
                              click: () => {
                                this.date.month = month.number
                                this.state = 'days'
                              }
                            },
                            key: `g-date-picker-month-${month.number}`
                          }
                        )
                      ]
                    )
                  })
                )
              })
            )
          ]
        )
      ]
    )
  }
}

function renderYears(h) {
  if (this.state === 'years') {
    return h(
      'div',
      {
        class: 'g-date-picker__years-list',
        ref: 'years-list'
      },
      [
        h(
          'g-list',
          {},
          this.years.map(year => {
            return h(
              'g-list-item',
              {
                class: {
                  'g-date-picker__years-list-item': true,
                  'g-date-picker__years-list-item--active': year === this.date.year,
                  'g-date-picker__years-list-item--current': year === today.getFullYear(),
                  'g-date-picker__years-list-item--selected': this.isActiveYear(year)
                },
                on: {
                  click: () => {
                    this.date.year = year
                    this.state = 'months'
                  }
                },
                key: `g-date-picker-year-${year}`
              },
              year
            )
          })
        )
      ]
    )
  }
}

export default function render(h) {
  return h(
    'div',
    {
      class: 'g-date-picker',
      ref: 'date-picker'
    },
    [
      renderHeader.call(this, h),
      renderDays.call(this, h),
      renderMonths.call(this, h),
      renderYears.call(this, h)
    ]
  )
}
