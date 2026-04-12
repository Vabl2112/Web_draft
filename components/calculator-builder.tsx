"use client"

import { useState, useMemo } from "react"
import { Plus, Trash2, GripVertical, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Types for the calculator builder
type InputType = "number" | "slider" | "dropdown" | "radio" | "checkbox"

interface ParameterOption {
  id: string
  label: string
  numericValue: number
}

interface CalculatorParameter {
  id: string
  variableName: string
  displayName: string
  inputType: InputType
  // For number/slider
  minValue: number
  maxValue: number
  defaultValue: number
  unit: string
  // For dropdown/radio
  options: ParameterOption[]
  // For checkbox
  valueIfChecked: number
  valueIfUnchecked: number
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// Default parameter
const createDefaultParameter = (): CalculatorParameter => ({
  id: generateId(),
  variableName: "",
  displayName: "",
  inputType: "number",
  minValue: 0,
  maxValue: 100,
  defaultValue: 50,
  unit: "",
  options: [],
  valueIfChecked: 1,
  valueIfUnchecked: 0,
})

export function CalculatorBuilder() {
  const [parameters, setParameters] = useState<CalculatorParameter[]>([])
  const [formula, setFormula] = useState("")

  // Add new parameter
  const addParameter = () => {
    setParameters([...parameters, createDefaultParameter()])
  }

  // Update parameter
  const updateParameter = (id: string, updates: Partial<CalculatorParameter>) => {
    setParameters(
      parameters.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  // Delete parameter
  const deleteParameter = (id: string) => {
    setParameters(parameters.filter((p) => p.id !== id))
  }

  // Add option to dropdown/radio parameter
  const addOption = (parameterId: string) => {
    const parameter = parameters.find((p) => p.id === parameterId)
    if (!parameter) return

    const newOption: ParameterOption = {
      id: generateId(),
      label: "",
      numericValue: 0,
    }

    updateParameter(parameterId, {
      options: [...parameter.options, newOption],
    })
  }

  // Update option
  const updateOption = (
    parameterId: string,
    optionId: string,
    updates: Partial<ParameterOption>
  ) => {
    const parameter = parameters.find((p) => p.id === parameterId)
    if (!parameter) return

    updateParameter(parameterId, {
      options: parameter.options.map((o) =>
        o.id === optionId ? { ...o, ...updates } : o
      ),
    })
  }

  // Delete option
  const deleteOption = (parameterId: string, optionId: string) => {
    const parameter = parameters.find((p) => p.id === parameterId)
    if (!parameter) return

    updateParameter(parameterId, {
      options: parameter.options.filter((o) => o.id !== optionId),
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Builder Panel (Left Column) */}
        <BuilderPanel
          parameters={parameters}
          formula={formula}
          onAddParameter={addParameter}
          onUpdateParameter={updateParameter}
          onDeleteParameter={deleteParameter}
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onDeleteOption={deleteOption}
          onFormulaChange={setFormula}
        />

        {/* Live Preview Panel (Right Column) */}
        <LivePreviewPanel parameters={parameters} formula={formula} />
      </div>
    </div>
  )
}

// Builder Panel Component
interface BuilderPanelProps {
  parameters: CalculatorParameter[]
  formula: string
  onAddParameter: () => void
  onUpdateParameter: (id: string, updates: Partial<CalculatorParameter>) => void
  onDeleteParameter: (id: string) => void
  onAddOption: (parameterId: string) => void
  onUpdateOption: (
    parameterId: string,
    optionId: string,
    updates: Partial<ParameterOption>
  ) => void
  onDeleteOption: (parameterId: string, optionId: string) => void
  onFormulaChange: (formula: string) => void
}

function BuilderPanel({
  parameters,
  formula,
  onAddParameter,
  onUpdateParameter,
  onDeleteParameter,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  onFormulaChange,
}: BuilderPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings2 className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            Calculator Configuration
          </h2>
        </div>
        <Button onClick={onAddParameter} className="gap-2">
          <Plus className="size-4" />
          Add Parameter
        </Button>
      </div>

      {/* Parameter Cards */}
      <div className="flex flex-col gap-4">
        {parameters.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No parameters yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click &quot;Add Parameter&quot; to start building your calculator
              </p>
            </CardContent>
          </Card>
        ) : (
          parameters.map((parameter) => (
            <ParameterCard
              key={parameter.id}
              parameter={parameter}
              onUpdate={(updates) => onUpdateParameter(parameter.id, updates)}
              onDelete={() => onDeleteParameter(parameter.id)}
              onAddOption={() => onAddOption(parameter.id)}
              onUpdateOption={(optionId, updates) =>
                onUpdateOption(parameter.id, optionId, updates)
              }
              onDeleteOption={(optionId) =>
                onDeleteOption(parameter.id, optionId)
              }
            />
          ))
        )}
      </div>

      {/* Formula Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Calculation Logic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="formula">Formula</Label>
            <Textarea
              id="formula"
              placeholder="Enter formula using variable names, e.g.: (a * b) + c"
              value={formula}
              onChange={(e) => onFormulaChange(e.target.value)}
              className="font-mono"
            />
          </div>
          {parameters.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Available variables:{" "}
              {parameters
                .filter((p) => p.variableName)
                .map((p) => p.variableName)
                .join(", ") || "none defined yet"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Parameter Card Component
interface ParameterCardProps {
  parameter: CalculatorParameter
  onUpdate: (updates: Partial<CalculatorParameter>) => void
  onDelete: () => void
  onAddOption: () => void
  onUpdateOption: (optionId: string, updates: Partial<ParameterOption>) => void
  onDeleteOption: (optionId: string) => void
}

function ParameterCard({
  parameter,
  onUpdate,
  onDelete,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
}: ParameterCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <GripVertical className="size-5 text-muted-foreground cursor-grab" />
          <span className="flex-1 font-medium truncate">
            {parameter.displayName || "Untitled Parameter"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Row 1: Basic Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`var-${parameter.id}`}>Variable Name</Label>
            <Input
              id={`var-${parameter.id}`}
              placeholder="a, b, c..."
              value={parameter.variableName}
              onChange={(e) =>
                onUpdate({
                  variableName: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, ""),
                })
              }
              maxLength={10}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`display-${parameter.id}`}>Display Name</Label>
            <Input
              id={`display-${parameter.id}`}
              placeholder="Width, Service Type..."
              value={parameter.displayName}
              onChange={(e) => onUpdate({ displayName: e.target.value })}
            />
          </div>
        </div>

        {/* Row 2: Type Selection */}
        <div className="space-y-2">
          <Label htmlFor={`type-${parameter.id}`}>Input Type</Label>
          <Select
            value={parameter.inputType}
            onValueChange={(value: InputType) => onUpdate({ inputType: value })}
          >
            <SelectTrigger id={`type-${parameter.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Number Input</SelectItem>
              <SelectItem value="slider">Slider</SelectItem>
              <SelectItem value="dropdown">Dropdown Select</SelectItem>
              <SelectItem value="radio">Radio Group</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Settings Area */}
        {(parameter.inputType === "number" ||
          parameter.inputType === "slider") && (
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor={`min-${parameter.id}`}>Min Value</Label>
              <Input
                id={`min-${parameter.id}`}
                type="number"
                value={parameter.minValue}
                onChange={(e) =>
                  onUpdate({ minValue: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`max-${parameter.id}`}>Max Value</Label>
              <Input
                id={`max-${parameter.id}`}
                type="number"
                value={parameter.maxValue}
                onChange={(e) =>
                  onUpdate({ maxValue: parseFloat(e.target.value) || 100 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`default-${parameter.id}`}>Default Value</Label>
              <Input
                id={`default-${parameter.id}`}
                type="number"
                value={parameter.defaultValue}
                onChange={(e) =>
                  onUpdate({ defaultValue: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`unit-${parameter.id}`}>Unit</Label>
              <Input
                id={`unit-${parameter.id}`}
                placeholder="cm, kg, $..."
                value={parameter.unit}
                onChange={(e) => onUpdate({ unit: e.target.value })}
              />
            </div>
          </div>
        )}

        {(parameter.inputType === "dropdown" ||
          parameter.inputType === "radio") && (
          <div className="space-y-3">
            <Label>Options</Label>
            {parameter.options.map((option) => (
              <div key={option.id} className="flex gap-2 items-center">
                <Input
                  placeholder="Option Label"
                  value={option.label}
                  onChange={(e) =>
                    onUpdateOption(option.id, { label: e.target.value })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Value"
                  value={option.numericValue}
                  onChange={(e) =>
                    onUpdateOption(option.id, {
                      numericValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-24"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:text-destructive shrink-0"
                  onClick={() => onDeleteOption(option.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={onAddOption}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Option
            </Button>
          </div>
        )}

        {parameter.inputType === "checkbox" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`checked-${parameter.id}`}>Value if Checked</Label>
              <Input
                id={`checked-${parameter.id}`}
                type="number"
                value={parameter.valueIfChecked}
                onChange={(e) =>
                  onUpdate({ valueIfChecked: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`unchecked-${parameter.id}`}>
                Value if Unchecked
              </Label>
              <Input
                id={`unchecked-${parameter.id}`}
                type="number"
                value={parameter.valueIfUnchecked}
                onChange={(e) =>
                  onUpdate({ valueIfUnchecked: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Live Preview Panel Component
interface LivePreviewPanelProps {
  parameters: CalculatorParameter[]
  formula: string
}

function LivePreviewPanel({ parameters, formula }: LivePreviewPanelProps) {
  const [values, setValues] = useState<Record<string, number>>({})

  // Get current value for a parameter
  const getValue = (param: CalculatorParameter): number => {
    if (values[param.variableName] !== undefined) {
      return values[param.variableName]
    }
    // Return default based on type
    switch (param.inputType) {
      case "number":
      case "slider":
        return param.defaultValue
      case "dropdown":
      case "radio":
        return param.options[0]?.numericValue || 0
      case "checkbox":
        return param.valueIfUnchecked
      default:
        return 0
    }
  }

  // Update value
  const updateValue = (variableName: string, value: number) => {
    setValues((prev) => ({ ...prev, [variableName]: value }))
  }

  // Calculate result
  const calculatedResult = useMemo(() => {
    if (!formula.trim() || parameters.length === 0) return 0

    try {
      let processedFormula = formula
      parameters.forEach((param) => {
        if (param.variableName) {
          const value = getValue(param)
          processedFormula = processedFormula.replace(
            new RegExp(`\\b${param.variableName}\\b`, "g"),
            String(value)
          )
        }
      })

      // Sanitize and evaluate
      const sanitized = processedFormula.replace(/[^0-9+\-*/().]/g, "")
      if (!sanitized) return 0
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${sanitized}`)()
      return typeof result === "number" && !isNaN(result) ? Math.round(result * 100) / 100 : 0
    } catch {
      return 0
    }
  }, [formula, parameters, values])

  return (
    <div className="lg:sticky lg:top-4 h-fit">
      <Card className="border-2 shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="text-lg">Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {parameters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No parameters to preview</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add parameters in the builder to see them here
              </p>
            </div>
          ) : (
            <>
              {/* Render each parameter */}
              {parameters.map((param) => (
                <PreviewParameter
                  key={param.id}
                  parameter={param}
                  value={getValue(param)}
                  onChange={(value) => updateValue(param.variableName, value)}
                />
              ))}

              {/* Total Result */}
              <div className="border-t border-border pt-6">
                <div className="rounded-xl bg-foreground p-6 text-center">
                  <p className="text-sm text-background/70 mb-1">Total Result</p>
                  <p className="text-4xl font-bold text-background">
                    $ {calculatedResult.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Preview Parameter Component
interface PreviewParameterProps {
  parameter: CalculatorParameter
  value: number
  onChange: (value: number) => void
}

function PreviewParameter({ parameter, value, onChange }: PreviewParameterProps) {
  const label = parameter.displayName || "Untitled"
  const unit = parameter.unit ? ` (${parameter.unit})` : ""

  switch (parameter.inputType) {
    case "number":
      return (
        <div className="space-y-2">
          <Label>{label}{unit}</Label>
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            min={parameter.minValue}
            max={parameter.maxValue}
          />
        </div>
      )

    case "slider":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>{label}{unit}</Label>
            <span className="text-sm font-medium text-foreground">
              {value}
              {parameter.unit && ` ${parameter.unit}`}
            </span>
          </div>
          <Slider
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            min={parameter.minValue}
            max={parameter.maxValue}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{parameter.minValue}{parameter.unit && ` ${parameter.unit}`}</span>
            <span>{parameter.maxValue}{parameter.unit && ` ${parameter.unit}`}</span>
          </div>
        </div>
      )

    case "dropdown":
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Select
            value={String(value)}
            onValueChange={(v) => onChange(parseFloat(v) || 0)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {parameter.options.map((option) => (
                <SelectItem key={option.id} value={String(option.numericValue)}>
                  {option.label || "Unnamed Option"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )

    case "radio":
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <RadioGroup
            value={String(value)}
            onValueChange={(v) => onChange(parseFloat(v) || 0)}
            className="flex flex-wrap gap-2"
          >
            {parameter.options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <RadioGroupItem
                  value={String(option.numericValue)}
                  id={`preview-${parameter.id}-${option.id}`}
                />
                <Label
                  htmlFor={`preview-${parameter.id}-${option.id}`}
                  className="font-normal cursor-pointer"
                >
                  {option.label || "Unnamed"}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )

    case "checkbox":
      return (
        <div className="flex items-center justify-between">
          <Label className="cursor-pointer">{label}</Label>
          <Switch
            checked={value === parameter.valueIfChecked}
            onCheckedChange={(checked) =>
              onChange(checked ? parameter.valueIfChecked : parameter.valueIfUnchecked)
            }
          />
        </div>
      )

    default:
      return null
  }
}
