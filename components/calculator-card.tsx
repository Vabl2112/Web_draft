"use client"

import { useState, useMemo, useEffect } from "react"
import useSWR from "swr"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Calculator } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalculatorEditor } from "@/components/calculator-editor"
import type { MasterCalculatorConfig, CalculatorVariable } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface CalculatorCardProps {
  artistId?: string
  isOwner?: boolean
  onEdit?: (calculator: MasterCalculatorConfig & { name?: string }) => void
  onDelete?: (index: number) => void
}

// Internal config format for rendering
interface CalculatorConfig {
  formula: string
  parameters: CalculatorVariable[]
  currency: string
}

function SingleCalculator({ 
  config, 
  isOwner,
  onEdit,
  onDelete
}: { 
  config: CalculatorConfig
  isOwner?: boolean
  onEdit?: (calculator: MasterCalculatorConfig & { name?: string }) => void
  onDelete?: () => void
}) {
  const [values, setValues] = useState<Record<string, number>>({})

  // Initialize values when config loads
  useEffect(() => {
    if (config?.parameters) {
      const initialValues: Record<string, number> = {}
      config.parameters.forEach(param => {
        if (param.type === "select" || param.type === "radio") {
          // Use first option's value as default
          initialValues[param.name] = param.options?.[0]?.value ?? 0
        } else if (param.type === "checkbox") {
          // Use unchecked value as default
          initialValues[param.name] = param.uncheckedValue ?? 0
        } else {
          initialValues[param.name] = param.defaultValue
        }
      })
      setValues(initialValues)
    }
  }, [config])

  const updateValue = (name: string, value: number) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const calculatedPrice = useMemo(() => {
    if (!config?.formula || Object.keys(values).length === 0) return 0
    
    try {
      let formula = config.formula
      Object.entries(values).forEach(([key, value]) => {
        formula = formula.replace(new RegExp(key, 'g'), String(value))
      })
      
      const sanitized = formula.replace(/[^0-9+\-*/().]/g, '')
      // eslint-disable-next-line no-new-func
      return Math.round(new Function(`return ${sanitized}`)())
    } catch {
      return 0
    }
  }, [config, values])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price)
  }

  const renderParameter = (param: CalculatorVariable) => {
    const value = values[param.name] ?? param.defaultValue
    
    switch (param.type) {
      case "slider":
        return (
          <div key={param.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-foreground">
                {param.label}
              </Label>
              <span className="rounded-md bg-foreground px-2.5 py-1 text-sm font-semibold text-background">
                {value}{param.unit || ""}
              </span>
            </div>
            <Slider
              value={[value]}
              onValueChange={([v]) => updateValue(param.name, v)}
              min={param.min || 0}
              max={param.max || 100}
              step={param.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{param.min || 0}{param.unit || ""}</span>
              <span>{param.max || 100}{param.unit || ""}</span>
            </div>
          </div>
        )
      
      case "number":
        return (
          <div key={param.id} className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              {param.label}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={value}
                onChange={(e) => updateValue(param.name, parseFloat(e.target.value) || 0)}
                min={param.min}
                max={param.max}
                step={param.step || 1}
                className="rounded-full border-border"
              />
              {param.unit && (
                <span className="text-sm text-muted-foreground">{param.unit}</span>
              )}
            </div>
          </div>
        )
      
      case "radio":
        // Find current selected index based on value
        const radioSelectedIdx = param.options?.findIndex(o => o.value === value) ?? 0
        return (
          <div key={param.id} className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              {param.label}
            </Label>
            <RadioGroup 
              value={`${radioSelectedIdx}`}
              onValueChange={(v) => {
                const idx = parseInt(v, 10)
                const optionValue = param.options?.[idx]?.value ?? 0
                updateValue(param.name, optionValue)
              }}
              className="flex flex-wrap gap-0 rounded-full border border-border bg-background p-1"
            >
              {param.options?.map((option, idx) => (
                <div key={`${param.id}-opt-${idx}`} className="flex items-center">
                  <RadioGroupItem 
                    value={`${idx}`}
                    id={`${param.id}-opt-${idx}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`${param.id}-opt-${idx}`}
                    className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:bg-muted"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )
      
      case "select":
        // Find current selected index based on value
        const selectedIdx = param.options?.findIndex(o => o.value === value) ?? 0
        return (
          <div key={param.id} className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              {param.label}
            </Label>
            <Select 
              value={`${selectedIdx}`}
              onValueChange={(v) => {
                const idx = parseInt(v, 10)
                const optionValue = param.options?.[idx]?.value ?? 0
                updateValue(param.name, optionValue)
              }}
            >
              <SelectTrigger className="rounded-full border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {param.options?.map((option, idx) => (
                  <SelectItem key={`${param.id}-opt-${idx}`} value={`${idx}`}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      
      case "checkbox":
        const isChecked = value === (param.checkedValue ?? 1)
        return (
          <div key={param.id} className="flex items-center justify-between gap-4 rounded-full border border-border px-4 py-3">
            <Label className="text-sm font-medium text-foreground">
              {param.label}
            </Label>
            <Switch
              checked={isChecked}
              onCheckedChange={(checked) => {
                updateValue(param.name, checked ? (param.checkedValue ?? 1) : (param.uncheckedValue ?? 0))
              }}
            />
          </div>
        )
      
      default:
        return null
    }
  }

  if (!config) return null

  return (
    <div className="relative">
      {/* Edit button for owner */}
      {isOwner && (
        <div className="absolute right-0 top-0 flex gap-1">
          <CalculatorEditor
            mode="edit"
            initialData={{
              variables: config.parameters.map(p => ({
                id: p.id,
                name: p.name,
                label: p.label,
                type: p.type,
                defaultValue: p.defaultValue,
                min: p.min,
                max: p.max,
                step: p.step,
                unit: p.unit,
                options: p.options,
                checkedValue: p.checkedValue,
                uncheckedValue: p.uncheckedValue
              })),
              formula: config.formula,
              currency: config.currency
            }}
            onSave={onEdit!}
            onDelete={onDelete}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Parameters */}
        <div className="grid gap-6 sm:grid-cols-2">
          {config.parameters.map(renderParameter)}
        </div>

        {/* Price Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6">
          <div className="text-center">
            <span className="text-4xl font-bold text-foreground">
              ≈ {formatPrice(calculatedPrice)} {config.currency}
            </span>
            <p className="mt-1 text-sm text-muted-foreground">
              Примерная стоимость
            </p>
          </div>
          
          <Button className="mt-6 w-full rounded-full py-6 text-base font-semibold">
            Записаться с этим расчетом
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CalculatorCard({ artistId = "1", isOwner, onEdit, onDelete }: CalculatorCardProps) {
  const { data, isLoading } = useSWR<{ formula: string; parameters: CalculatorVariable[]; currency: string }>(
    `/api/calculator/${artistId}`,
    fetcher
  )

  // Convert API response to internal config format
  const config: CalculatorConfig | null = data ? {
    formula: data.formula,
    parameters: data.parameters,
    currency: data.currency
  } : null

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="grid gap-6 sm:grid-cols-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calculator className="mb-4 size-12 text-muted-foreground" />
        <p className="text-muted-foreground">Калькуляторов пока нет</p>
        {isOwner && (
          <p className="mt-1 text-sm text-muted-foreground">
            Добавьте калькулятор, нажав кнопку выше
          </p>
        )}
      </div>
    )
  }

  return (
    <SingleCalculator 
      config={config} 
      isOwner={isOwner}
      onEdit={onEdit}
      onDelete={() => onDelete?.(0)}
    />
  )
}
