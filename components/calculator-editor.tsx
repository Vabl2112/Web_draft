"use client"

import { useState } from "react"
import { 
  Plus, 
  Save, 
  Trash2, 
  Calculator, 
  Variable, 
  FunctionSquare,
  Settings,
  Copy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { MasterCalculatorConfig, CalculatorVariable } from "@/lib/types"

interface CalculatorEditorProps {
  mode: "add" | "edit"
  initialData?: MasterCalculatorConfig & { name?: string }
  onSave: (data: MasterCalculatorConfig & { name?: string }) => void
  onDelete?: () => void
  trigger?: React.ReactNode
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
  const [variables, setVariables] = useState<CalculatorVariable[]>(
    initialData?.variables || []
  )
  const [formula, setFormula] = useState(initialData?.formula || "")
  const [currency, setCurrency] = useState(initialData?.currency || "₽")
  
  // New variable form
  const [newVarName, setNewVarName] = useState("")
  const [newVarLabel, setNewVarLabel] = useState("")
  const [newVarType, setNewVarType] = useState<"slider" | "number" | "select">("slider")
  const [newVarMin, setNewVarMin] = useState("1")
  const [newVarMax, setNewVarMax] = useState("100")
  const [newVarDefault, setNewVarDefault] = useState("10")
  const [newVarUnit, setNewVarUnit] = useState("")
  const [showAddVariable, setShowAddVariable] = useState(false)

  const handleAddVariable = () => {
    if (!newVarName.trim() || !newVarLabel.trim()) return
    if (variables.some(v => v.name === newVarName.toLowerCase())) return // Duplicate check
    
    const newVariable: CalculatorVariable = {
      id: newVarName.toLowerCase(),
      name: newVarName.toLowerCase(),
      label: newVarLabel,
      type: newVarType,
      defaultValue: parseFloat(newVarDefault) || 1,
      min: parseFloat(newVarMin) || 1,
      max: parseFloat(newVarMax) || 100,
      step: 1,
      unit: newVarUnit || undefined,
    }
    
    setVariables([...variables, newVariable])
    
    // Reset form
    setNewVarName("")
    setNewVarLabel("")
    setNewVarType("slider")
    setNewVarMin("1")
    setNewVarMax("100")
    setNewVarDefault("10")
    setNewVarUnit("")
    setShowAddVariable(false)
  }

  const handleRemoveVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id))
  }

  const handleSave = () => {
    if (variables.length === 0 || !formula.trim()) return
    
    onSave({
      name,
      variables,
      formula,
      currency,
    })
    
    // Reset form if adding new
    if (mode === "add") {
      setName("Калькулятор стоимости")
      setVariables([])
      setFormula("")
      setCurrency("₽")
    }
    
    setIsOpen(false)
  }

  // Preview calculated price
  const previewPrice = () => {
    try {
      let f = formula
      variables.forEach(v => {
        f = f.replace(new RegExp(v.name, 'g'), String(v.defaultValue))
      })
      const sanitized = f.replace(/[^0-9+\-*/().]/g, '')
      // eslint-disable-next-line no-new-func
      return Math.round(new Function(`return ${sanitized}`)())
    } catch {
      return 0
    }
  }

  const defaultTrigger = mode === "add" ? (
    <Button variant="outline" size="sm" className="gap-2">
      <Plus className="size-4" />
      Добавить калькулятор
    </Button>
  ) : (
    <Button variant="ghost" size="icon" className="size-8">
      <Settings className="size-4" />
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="size-5" />
            {mode === "add" ? "Добавить калькулятор" : "Редактировать калькулятор"}
          </DialogTitle>
          <DialogDescription>
            Настройте переменные и формулу расчета стоимости
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
              <div className="flex items-center gap-2">
                <Variable className="size-4" />
                <CardTitle className="text-sm">Переменные</CardTitle>
              </div>
              <CardDescription>
                Настройте параметры, которые клиент будет выбирать
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {variables.map((variable) => (
                <div key={variable.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded bg-muted font-mono font-bold">
                    {variable.name}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{variable.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {variable.type === "slider" && `Слайдер: ${variable.min}-${variable.max}`}
                      {variable.type === "number" && "Числовое поле"}
                      {variable.type === "select" && `Выбор: ${variable.options?.length || 0} опций`}
                      {variable.unit && ` (${variable.unit})`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive"
                    onClick={() => handleRemoveVariable(variable.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              
              {showAddVariable ? (
                <div className="rounded-lg border border-border p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Имя переменной</Label>
                      <Input
                        placeholder="a, b, c..."
                        value={newVarName}
                        onChange={(e) => setNewVarName(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
                        maxLength={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Тип</Label>
                      <Select value={newVarType} onValueChange={(v) => setNewVarType(v as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slider">Слайдер</SelectItem>
                          <SelectItem value="number">Число</SelectItem>
                          <SelectItem value="select">Выбор</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Название для клиента</Label>
                    <Input
                      placeholder="например: Размер (см)"
                      value={newVarLabel}
                      onChange={(e) => setNewVarLabel(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-2">
                      <Label>Мин</Label>
                      <Input
                        type="number"
                        value={newVarMin}
                        onChange={(e) => setNewVarMin(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Макс</Label>
                      <Input
                        type="number"
                        value={newVarMax}
                        onChange={(e) => setNewVarMax(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>По умолч.</Label>
                      <Input
                        type="number"
                        value={newVarDefault}
                        onChange={(e) => setNewVarDefault(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Единица</Label>
                      <Input
                        placeholder="см"
                        value={newVarUnit}
                        onChange={(e) => setNewVarUnit(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAddVariable(false)}>
                      Отмена
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleAddVariable}
                      disabled={!newVarName || !newVarLabel}
                    >
                      Добавить
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowAddVariable(true)}
                >
                  <Plus className="size-4" />
                  Добавить переменную
                </Button>
              )}
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
                Используйте переменные: {variables.map(v => v.name).join(", ") || "добавьте переменные"}
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
              
              {variables.length > 0 && formula && (
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm text-muted-foreground">Предпросмотр:</span>
                  <span className="text-lg font-bold">
                    ≈ {previewPrice().toLocaleString("ru-RU")} {currency}
                  </span>
                </div>
              )}
              
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
