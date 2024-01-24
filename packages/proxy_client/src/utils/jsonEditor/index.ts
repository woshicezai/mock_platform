export default class JSONEditor {
  private id: string
  private editor: AceAjax.Editor
  constructor(id: string) {
    this.id = id
    this.editor = this.init()
  }
  private init() {
    const editor = ace.edit(this.id)
    editor.setTheme('ace/theme/chrome')
    editor.session.setMode('ace/mode/json')
    return editor
  }
  setValue<T>(value: T) {
    this.editor.setValue(JSON.stringify(value, null, 2))
  }
  getValue<T>(): T {
    return JSON.parse(this.editor.getValue() || '{}') as T
  }

  editModal(isEdit: boolean) {
    this.editor.setReadOnly(!isEdit)
  }
}
