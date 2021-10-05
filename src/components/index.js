export default {
  install: Vue => {
    for (const component of [
      'GApp',
      'GAvatar',
      'GButton',
      'GCard',
      'GCardActions',
      'GCheckbox',
      'GChip',
      'GContent',
      'GDatePicker',
      'GDialog',
      'GDivider',
      'GEmpty',
      'GExpansionPanel',
      'GExpansionPanels',
      'GFooter',
      'GForm',
      'GIcon',
      'GInput',
      'GList',
      'GListGroup',
      'GListItem',
      'GMenu',
      'GOverlay',
      'GProgress',
      'GSidebar',
      'GSnackbar',
      'GSubheader',
      'GSwitch',
      'GTable',
      'GTabs',
      'GTabsHeader',
      'GTextarea',
      'GTextOverflow',
      'GToolbar',
      'GTooltip'
    ]) {
      Vue.component(component, require(`./${component}`).default)
    }
  }
}
