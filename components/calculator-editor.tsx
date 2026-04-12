"use client"

import { useState } from "react"
import { 
  Plus, 
  Save, 
  Trash2, 
  Calculator, 
  Variable, 
  FunctionSquare,
  GripVertical,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { MasterCalculatorConfig, CalculatorVariable } from "@/lib/types"

interface CalculatorEditorProps {
  mode: "add" | "edit"
  initialData?: MasterCalculatorConfig & { name?: string }
  onSave: (data: MasterCalculatorConfig & { name?: string }) => void
  onDelete?: () => void
  trigger?: React.ReactNode
}

// Option type for select/radio
interface OptionItem {
  id: string
  label: string
  value: number
}

// Extended variable with options
interface EditorVariable extends Omit<CalculatorVariable, 'options'> {
  options: OptionItem[]
  isExpanded: boolean
}

export function CalculatorEditor({ 
  mode = "add", 
  initialData,
  onSave,
  onDelete,
  trigger
}: CalculatorEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(initialData?.name || "Калькулятор стоимости")
  const [variables, setVariables] = useState<EditorVariable[]>(() => {
    if (initialData?.variables) {
      return initialData.variables.map(v => ({
        ...v,
        options: v.options?.map((o, i) => ({ id: `opt-${i}`, label: o.label, value: o.value })) || [],
        isExpanded: false
      }))
    }
    return []
  })
  const [formula, setFormula] = useState(initialData?.formula || "")
  const [currency, setCurrency] = useState(initialData?.currency || "₽")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }
    
    const newVariables = [...variables]
    const [draggedItem] = newVariables.splice(draggedIndex, 1)
    newVariables.splice(dropIndex, 0, draggedItem)
    setVariables(newVariables)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const generateVarName = () => {
    const usedNames = variables.map(v => v.name)
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
    return alphabet.find(letter => !usedNames.includes(letter)) || 'x'
  }

  const handleAddVariable = () => {
    const newVar: EditorVariable = {
      id: `var-${Date.now()}`,
      name: generateVarName(),
      label: "",
      type: "slider",
      defaultValue: 10,
      min: 1,
      max: 100,
      step: 1,
      unit: "",
      options: [],
      checkedValue: 1,
      uncheckedValue: 0,
      isExpanded: true
    }
    setVariables([...variables, newVar])
  }

  const updateVariable = (id: string, updates: Partial<EditorVariable>) => {
    setVariables(variables.map(v => 
      v.id === id ? { ...v, ...updates } : v
    ))
  }

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id))
  }

  const addOption = (varId: string) => {
    setVariables(variables.map(v => {
      if (v.id === varId) {
        return {
          ...v,
          options: [...v.options, { id: `opt-${Date.now()}`, label: "", value: 1 }]
        }
      }
      return v
    }))
  }

  const updateOption = (varId: string, optId: string, updates: Partial<OptionItem>) => {
    setVariables(variables.map(v => {
      if (v.id === varId) {
        return {
          ...v,
          options: v.options.map(o => o.id === optId ? { ...o, ...updates } : o)
        }
      }
      return v
    }))
  }

  const removeOption = (varId: string, optId: string) => {
    setVariables(variables.map(v => {
      if (v.id === varId) {
        return {
          ...v,
          options: v.options.filter(o => o.id !== optId)
        }
      }
      return v
    }))
  }

  const handleSave = () => {
    if (variables.length === 0 || !formula.trim()) return
    
    // Convert to MasterCalculatorConfig format
    const config: MasterCalculatorConfig & { name?: string } = {
      name,
      variables: variables.map(v => ({
        id: v.id,
        name: v.name,
        label: v.label,
        type: v.type,
        defaultValue: v.defaultValue,
        min: v.min,
        max: v.max,
        step: v.step,
        unit: v.unit,
        options: v.options.map(o => ({ value: o.value, label: o.label })),
        checkedValue: v.checkedValue,
        uncheckedValue: v.uncheckedValue
      })),
      formula,
      currency,
    }
    
    onSave(config)
    
    if (mode === "add") {
      setName("Калькулятор стоимости")
      setVariables([])
      setFormula("")
      setCurrency("₽")
    }
    
    setIsOpen(false)
  }

  // Validate formula for invalid number formats like "50 0"
  const validateFormula = (formulaStr: string): { valid: boolean; error?: string } => {
    // Check for invalid number patterns (numbers with spaces like "50 0")
    // Match: digit, then space, then digit (but not separated by operators)
    if (/\d\s+\d/.test(formulaStr)) {
      // Find the exact invalid pattern for error message
      const match = formulaStr.match(/\d+\s+\d+/)
      if (match) {
        return { valid: false, error: `Некорректное число: "${match[0]}"` }
      }
      return { valid: false, error: "Некорректный формат числа" }
    }
    return { valid: true }
  }

  // Preview calculated price
  const previewPrice = (): { value: number; error?: string } => {
    // First validate the formula
    const validation = validateFormula(formula)
    if (!validation.valid) {
      return { value: 0, error: validation.error }
    }

    try {
      let f = formula
      variables.forEach(v => {
        let value = v.defaultValue
        
        // For select/radio, use first option's value if available
        if ((v.type === "select" || v.type === "radio") && v.options.length > 0) {
          value = v.options[0].value
        }
        // For checkbox, use checkedValue
        if (v.type === "checkbox") {
          value = v.checkedValue || 1
        }
        
        f = f.replace(new RegExp(v.name, 'g'), String(value))
      })

      // Check again after variable substitution
      const postValidation = validateFormula(f)
      if (!postValidation.valid) {
        return { value: 0, error: postValidation.error }
      }

      const sanitized = f.replace(/[^0-9+\-*/().]/g, '')
      // eslint-disable-next-line no-new-func
      return { value: Math.round(new Function(`return ${sanitized}`)()) }
    } catch {
      return { value: 0, error: "Ошибка в формуле" }
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "slider": return "Слайдер"
      case "number": return "Число"
      case "select": return "Выпадающий список"
      case "radio": return "Переключатель"
      case "checkbox": return "Чекбокс"
      default: return type
    }
  }

  const defaultTrigger = mode === "add" ? (
    <Button variant="outline" size="sm" className="gap-2">
      <Plus className="size-4" />
      Добавить калькулятор
    </Button>
  ) : (
    <Button variant="ghost" size="icon" className="size-8">
      <Calculator className="size-4" />
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="size-5" />
            {mode === "add" ? "Добавить калькулятор" : "Редактировать калькулятор"}
          </DialogTitle>
          <DialogDescription>
            Настройте параметры и формулу расчета стоимости
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Calculator Name */}
          <div className="space-y-2">
            <Label>Название калькулятора</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="например: Калькулятор тату"
            />
          </div>
          
          {/* Variables Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Variable className="size-4" />
                  <CardTitle className="text-sm">Параметры</CardTitle>
                </div>
                <Button size="sm" variant="outline" onClick={handleAddVariable} className="gap-1">
                  <Plus className="size-3" />
                  Добавить
                </Button>
              </div>
              <CardDescription>
                Настройте параметры, которые клиент будет выбирать
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {variables.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Добавьте параметры для калькулятора
                </div>
              )}
              
              {variables.map((variable, index) => (
                <Collapsible 
                  key={variable.id} 
                  open={variable.isExpanded}
                  onOpenChange={(open) => updateVariable(variable.id, { isExpanded: open })}
                >
                  <div 
                    className={`rounded-lg border transition-all ${
                      dragOverIndex === index 
                        ? "border-primary border-2 bg-primary/5" 
                        : draggedIndex === index 
                          ? "opacity-50 border-dashed border-muted-foreground" 
                          : "border-border"
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Header */}
                    <CollapsibleTrigger asChild>
                      <div className="flex cursor-pointer items-center gap-3 p-3 hover:bg-muted/50">
                        <GripVertical className="size-4 cursor-grab text-muted-foreground active:cursor-grabbing" />
                        <div className="flex size-8 shrink-0 items-center justify-center rounded bg-primary font-mono font-bold text-primary-foreground">
                          {variable.name}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {variable.label || "Без названия"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getTypeLabel(variable.type)}
                            {variable.type === "slider" && ` • ${variable.min}-${variable.max}`}
                            {(variable.type === "select" || variable.type === "radio") && ` • ${variable.options.length} опций`}
                            {variable.unit && ` • ${variable.unit}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeVariable(variable.id)
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        {variable.isExpanded ? (
                          <ChevronUp className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    
                    {/* Expanded Content */}
                    <CollapsibleContent>
                      <div className="border-t border-border p-4 space-y-4">
                        {/* Basic Fields */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Имя переменной</Label>
                            <Input
                              placeholder="a, b, c..."
                              value={variable.name}
                              onChange={(e) => updateVariable(variable.id, { 
                                name: e.target.value.toLowerCase().replace(/[^a-z]/g, '')
                              })}
                              maxLength={1}
                              className="font-mono"
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label className="text-xs">Название для клиента</Label>
                            <Input
                              placeholder="например: Размер"
                              value={variable.label}
                              onChange={(e) => updateVariable(variable.id, { label: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Тип ввода</Label>
                          <Select 
                            value={variable.type} 
                            onValueChange={(v) => updateVariable(variable.id, { 
                              type: v as EditorVariable['type'],
                              // Reset options when switching type
                              options: (v === "select" || v === "radio") ? variable.options : []
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="slider">Слайдер</SelectItem>
                              <SelectItem value="number">Числовое поле</SelectItem>
                              <SelectItem value="select">Выпадающий список</SelectItem>
                              <SelectItem value="radio">Переключатель (Radio)</SelectItem>
                              <SelectItem value="checkbox">Чекбокс (Да/Нет)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Type-specific settings */}
                        {(variable.type === "slider" || variable.type === "number") && (
                          <div className="grid grid-cols-4 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Мин</Label>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="1"
                                value={variable.min === 0 ? "" : variable.min}
                                onChange={(e) => {
                                  const val = e.target.value.trim()
                                  if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                                    updateVariable(variable.id, { min: val === "" ? 0 : parseFloat(val) })
                                  }
                                }}
                                className={variable.min === 0 ? "text-muted-foreground/50" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Макс</Label>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="100"
                                value={variable.max === 0 ? "" : variable.max}
                                onChange={(e) => {
                                  const val = e.target.value.trim()
                                  if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                                    updateVariable(variable.id, { max: val === "" ? 0 : parseFloat(val) })
                                  }
                                }}
                                className={variable.max === 0 ? "text-muted-foreground/50" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">По умолч.</Label>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={variable.defaultValue === 0 ? "" : variable.defaultValue}
                                onChange={(e) => {
                                  const val = e.target.value.trim()
                                  if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                                    updateVariable(variable.id, { defaultValue: val === "" ? 0 : parseFloat(val) })
                                  }
                                }}
                                className={variable.defaultValue === 0 ? "text-muted-foreground/50" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Единица</Label>
                              <Input
                                placeholder="см, кг..."
                                value={variable.unit || ""}
                                onChange={(e) => updateVariable(variable.id, { unit: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                        
                        {(variable.type === "select" || variable.type === "radio") && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">Варианты выбора</Label>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 gap-1 text-xs"
                                onClick={() => addOption(variable.id)}
                              >
                                <Plus className="size-3" />
                                Добавить
                              </Button>
                            </div>
                            
                            {variable.options.length === 0 && (
                              <p className="text-xs text-muted-foreground py-2">
                                Добавьте варианты для выбора
                              </p>
                            )}
                            
                            <div className="space-y-2">
                                              {variable.options.map((option, optIndex) => (
                                                <div key={option.id} className="flex items-center gap-2">
                                                  <span className="text-xs text-muted-foreground w-4">{optIndex + 1}.</span>
                                                  <Input
                                                    placeholder="Название (напр. Реализм)"
                                                    value={option.label}
                                                    onChange={(e) => updateOption(variable.id, option.id, { label: e.target.value })}
                                                    className="flex-1"
                                                  />
                                                  <div className="relative w-24">
                                                    <Input
                                                      type="text"
                                                      inputMode="numeric"
                                                      placeholder="0"
                                                      value={option.value === 0 ? "" : option.value}
                                                      onChange={(e) => {
                                                        const val = e.target.value.trim()
                                                        // Only allow valid numbers
                                                        if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                                                          updateOption(variable.id, option.id, { 
                                                            value: val === "" ? 0 : parseFloat(val) 
                                                          })
                                                        }
                                                      }}
                                                      className={option.value === 0 ? "text-muted-foreground/50" : ""}
                                                    />
                                                  </div>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0 size-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeOption(variable.id, option.id)}
                                                  >
                                                    <Trash2 className="size-3" />
                                                  </Button>
                                                </div>
                                              ))}
                            </div>
                            
                            <p className="text-xs text-muted-foreground">
                              Вес используется в формуле для расчета. Например: Реализм = 100, Олдскул = 50
                            </p>
                          </div>
                        )}
                        
                        {variable.type === "checkbox" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs">Значение если выбрано</Label>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={variable.checkedValue === 0 ? "" : variable.checkedValue}
                                onChange={(e) => {
                                  const val = e.target.value.trim()
                                  if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                                    updateVariable(variable.id, { checkedValue: val === "" ? 0 : parseFloat(val) })
                                  }
                                }}
                                className={variable.checkedValue === 0 ? "text-muted-foreground/50" : ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Значение если не выбрано</Label>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={variable.uncheckedValue === 0 ? "" : variable.uncheckedValue}
                                onChange={(e) => {
                                  const val = e.target.value.trim()
                                  if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                                    updateVariable(variable.id, { uncheckedValue: val === "" ? 0 : parseFloat(val) })
                                  }
                                }}
                                className={variable.uncheckedValue === 0 ? "text-muted-foreground/50" : ""}
                              />
                            </div>
                            <p className="col-span-2 text-xs text-muted-foreground">
                              Эти значения будут подставлены в формулу
                            </p>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
          
          {/* Formula Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FunctionSquare className="size-4" />
                <CardTitle className="text-sm">Формула расчета</CardTitle>
              </div>
              <CardDescription>
                Доступные переменные: {variables.length > 0 ? variables.map(v => v.name).join(", ") : "добавьте параметры"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3 font-mono">
                <span className="text-muted-foreground">Цена =</span>
                <Input
                  className="border-0 bg-transparent font-mono focus-visible:ring-0"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="(a * 500 * b * c)"
                />
              </div>
              
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-2">Поддерживаемые операции:</p>
                <div className="flex flex-wrap gap-2">
                  {["+", "-", "*", "/", "(", ")"].map(op => (
                    <Badge key={op} variant="outline" className="font-mono">{op}</Badge>
                  ))}
                </div>
              </div>
              
              {variables.length > 0 && formula && (() => {
                const preview = previewPrice()
                return (
                  <div className={`flex items-center justify-between rounded-lg border p-3 ${preview.error ? "border-destructive bg-destructive/5" : "border-border"}`}>
                    <span className="text-sm text-muted-foreground">Предпросмотр:</span>
                    {preview.error ? (
                      <span className="text-sm font-medium text-destructive">
                        {preview.error}
                      </span>
                    ) : (
                      <span className="text-lg font-bold">
                        ≈ {preview.value.toLocaleString("ru-RU")} {currency}
                      </span>
                    )}
                  </div>
                )
              })()}
              
              <div className="space-y-2">
                <Label>Валюта</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₽">₽ (Рубли)</SelectItem>
                    <SelectItem value="$">$ (Доллары)</SelectItem>
                    <SelectItem value="€">€ (Евро)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {mode === "edit" && onDelete && (
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete()
                setIsOpen(false)
              }}
              className="mr-auto"
            >
              <Trash2 className="size-4 mr-2" />
              Удалить
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={variables.length === 0 || !formula.trim()}
            className="gap-2"
          >
            <Save className="size-4" />
            {mode === "add" ? "Добавить" : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
