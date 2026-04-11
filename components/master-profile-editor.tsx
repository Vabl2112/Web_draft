"use client"

import { useState } from "react"
import Image from "next/image"
import { 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Calculator,
  Save,
  Settings,
  ImageIcon,
  FileText,
  Tags,
  Package,
  Eye,
  EyeOff,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Variable,
  FunctionSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Types for calculator configuration
interface CalculatorVariable {
  id: string
  name: string // Variable name like 'a', 'b', 'c'
  label: string // Display label for users
  type: "slider" | "number" | "select"
  defaultValue: number
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: { value: number; label: string }[]
}

interface CalculatorConfig {
  variables: CalculatorVariable[]
  formula: string
  currency: string
}

// Types for portfolio and services
interface PortfolioImage {
  id: string
  url: string
  title: string
}

interface Service {
  id: string
  title: string
  description: string
  price: string
}

// Sample data
const initialPortfolio: PortfolioImage[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop", title: "Японский дракон" },
  { id: "2", url: "https://images.unsplash.com/photo-1590246814883-57764a58d1a3?w=400&h=400&fit=crop", title: "Неотрад роза" },
  { id: "3", url: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&h=400&fit=crop", title: "Минимализм" },
  { id: "4", url: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=400&fit=crop", title: "Геометрия" },
]

const initialServices: Service[] = [
  { id: "1", title: "Консультация", description: "Обсуждение эскиза и расчет стоимости", price: "Бесплатно" },
  { id: "2", title: "Эскиз на заказ", description: "Разработка индивидуального дизайна", price: "от 3000 ₽" },
  { id: "3", title: "Татуировка", description: "Нанесение татуировки любой сложности", price: "от 5000 ₽" },
]

const initialCalculatorConfig: CalculatorConfig = {
  variables: [
    { id: "a", name: "a", label: "Размер (см)", type: "slider", defaultValue: 10, min: 1, max: 50, step: 1, unit: "см" },
    { id: "b", name: "b", label: "Сложность", type: "select", defaultValue: 1, options: [
      { value: 1, label: "Простая" },
      { value: 2, label: "Средняя" },
      { value: 3, label: "Сложная" },
    ]},
    { id: "c", name: "c", label: "Цветная", type: "select", defaultValue: 1, options: [
      { value: 1, label: "Черно-белая" },
      { value: 1.5, label: "Цветная" },
    ]},
  ],
  formula: "(a * 500 * b * c)",
  currency: "₽",
}

export function MasterProfileEditor() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("portfolio")
  
  // Profile data
  const [bio, setBio] = useState("Профессиональный тату-мастер с 10-летним опытом. Специализируюсь на японской традиционной татуировке и неотраде.")
  const [tags, setTags] = useState<string[]>(["Японский стиль", "Неотрад", "Блэкворк", "Орнаментал"])
  const [newTag, setNewTag] = useState("")
  
  // Section visibility
  const [showPortfolio, setShowPortfolio] = useState(true)
  const [showServices, setShowServices] = useState(true)
  const [showCalculator, setShowCalculator] = useState(true)
  const [showReviews, setShowReviews] = useState(true)
  
  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioImage[]>(initialPortfolio)
  
  // Services
  const [services, setServices] = useState<Service[]>(initialServices)
  const [newService, setNewService] = useState<Partial<Service>>({})
  
  // Calculator config
  const [calculatorConfig, setCalculatorConfig] = useState<CalculatorConfig>(initialCalculatorConfig)
  const [newVariable, setNewVariable] = useState<Partial<CalculatorVariable>>({})
  const [calculatorDialogOpen, setCalculatorDialogOpen] = useState(false)
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
  
  const handleRemovePortfolioImage = (id: string) => {
    setPortfolio(portfolio.filter(img => img.id !== id))
  }
  
  const handleAddService = () => {
    if (newService.title && newService.price) {
      setServices([...services, {
        id: Date.now().toString(),
        title: newService.title,
        description: newService.description || "",
        price: newService.price,
      }])
      setNewService({})
    }
  }
  
  const handleRemoveService = (id: string) => {
    setServices(services.filter(s => s.id !== id))
  }
  
  const handleAddVariable = () => {
    if (newVariable.name && newVariable.label) {
      const variable: CalculatorVariable = {
        id: newVariable.name,
        name: newVariable.name,
        label: newVariable.label,
        type: newVariable.type || "slider",
        defaultValue: newVariable.defaultValue || 1,
        min: newVariable.min || 1,
        max: newVariable.max || 100,
        step: newVariable.step || 1,
        unit: newVariable.unit || "",
        options: newVariable.options,
      }
      setCalculatorConfig(prev => ({
        ...prev,
        variables: [...prev.variables, variable]
      }))
      setNewVariable({})
    }
  }
  
  const handleRemoveVariable = (id: string) => {
    setCalculatorConfig(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v.id !== id)
    }))
  }
  
  const handleSave = async () => {
    // In real app, save to API
    const configData = {
      bio,
      tags,
      sections: { showPortfolio, showServices, showCalculator, showReviews },
      portfolio,
      services,
      calculatorConfig,
    }
    console.log("[v0] Saving master profile:", configData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsOpen(false)
  }
  
  // Preview calculated price
  const previewPrice = () => {
    try {
      let formula = calculatorConfig.formula
      calculatorConfig.variables.forEach(v => {
        formula = formula.replace(new RegExp(v.name, 'g'), String(v.defaultValue))
      })
      const sanitized = formula.replace(/[^0-9+\-*/().]/g, '')
      // eslint-disable-next-line no-new-func
      return Math.round(new Function(`return ${sanitized}`)())
    } catch {
      return 0
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="size-4" />
          Редактировать профиль
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Редактирование профиля мастера</SheetTitle>
          <SheetDescription>
            Настройте отображение вашего профиля для клиентов
          </SheetDescription>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio" className="text-xs sm:text-sm">
              <ImageIcon className="mr-1 size-4 sm:mr-2" />
              <span className="hidden sm:inline">Фото</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs sm:text-sm">
              <FileText className="mr-1 size-4 sm:mr-2" />
              <span className="hidden sm:inline">Инфо</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm">
              <Package className="mr-1 size-4 sm:mr-2" />
              <span className="hidden sm:inline">Услуги</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs sm:text-sm">
              <Calculator className="mr-1 size-4 sm:mr-2" />
              <span className="hidden sm:inline">Цены</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Портфолио</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="show-portfolio" className="text-sm text-muted-foreground">
                  Показывать
                </Label>
                <Switch
                  id="show-portfolio"
                  checked={showPortfolio}
                  onCheckedChange={setShowPortfolio}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {portfolio.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg">
                  <Image src={img.url} alt={img.title} fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="size-8"
                      onClick={() => handleRemovePortfolioImage(img.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white truncate">{img.title}</p>
                  </div>
                </div>
              ))}
              
              {/* Add new photo button */}
              <button className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-foreground/50 hover:bg-muted">
                <Upload className="mb-2 size-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Добавить</span>
              </button>
            </div>
          </TabsContent>
          
          {/* Info Tab */}
          <TabsContent value="info" className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Расскажите о себе..."
                className="min-h-24 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-right text-muted-foreground">{bio.length}/500</p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label>Теги и стили</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Добавить тег..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                />
                <Button variant="outline" onClick={handleAddTag}>
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Label className="text-base font-semibold">Отображаемые разделы</Label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="size-5 text-muted-foreground" />
                    <span>Портфолио</span>
                  </div>
                  <Switch checked={showPortfolio} onCheckedChange={setShowPortfolio} />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Package className="size-5 text-muted-foreground" />
                    <span>Услуги и товары</span>
                  </div>
                  <Switch checked={showServices} onCheckedChange={setShowServices} />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Calculator className="size-5 text-muted-foreground" />
                    <span>Калькулятор цен</span>
                  </div>
                  <Switch checked={showCalculator} onCheckedChange={setShowCalculator} />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-muted-foreground" />
                    <span>Отзывы</span>
                  </div>
                  <Switch checked={showReviews} onCheckedChange={setShowReviews} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Services Tab */}
          <TabsContent value="services" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Услуги и товары</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="show-services" className="text-sm text-muted-foreground">
                  Показывать
                </Label>
                <Switch
                  id="show-services"
                  checked={showServices}
                  onCheckedChange={setShowServices}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className="flex-1">
                    <p className="font-medium">{service.title}</p>
                    {service.description && (
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    )}
                    <p className="mt-1 text-sm font-semibold">{service.price}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive"
                    onClick={() => handleRemoveService(service.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Добавить услугу</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Название"
                  value={newService.title || ""}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                />
                <Input
                  placeholder="Описание (необязательно)"
                  value={newService.description || ""}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Цена"
                    value={newService.price || ""}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                  <Button onClick={handleAddService}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Calculator Tab */}
          <TabsContent value="calculator" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Калькулятор цен</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="show-calc" className="text-sm text-muted-foreground">
                  Показывать
                </Label>
                <Switch
                  id="show-calc"
                  checked={showCalculator}
                  onCheckedChange={setShowCalculator}
                />
              </div>
            </div>
            
            {/* Variables Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Variable className="size-4" />
                  <CardTitle className="text-sm">Переменные</CardTitle>
                </div>
                <CardDescription>
                  Настройте переменные для формулы расчета
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculatorConfig.variables.map((variable) => (
                  <div key={variable.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded bg-muted font-mono font-bold">
                      {variable.name}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{variable.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {variable.type === "slider" && `Слайдер: ${variable.min}-${variable.max}`}
                        {variable.type === "number" && "Числовое поле"}
                        {variable.type === "select" && `Выбор: ${variable.options?.length} опций`}
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
                
                {/* Add Variable Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Plus className="size-4" />
                      Добавить переменную
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новая переменная</DialogTitle>
                      <DialogDescription>
                        Настройте параметры новой переменной для калькулятора
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Имя переменной</Label>
                          <Input
                            placeholder="например: d"
                            value={newVariable.name || ""}
                            onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value.toLowerCase().replace(/[^a-z]/g, '') })}
                            maxLength={1}
                          />
                          <p className="text-xs text-muted-foreground">Одна латинская буква</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Тип ввода</Label>
                          <Select
                            value={newVariable.type || "slider"}
                            onValueChange={(v) => setNewVariable({ ...newVariable, type: v as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="slider">Слайдер</SelectItem>
                              <SelectItem value="number">Число</SelectItem>
                              <SelectItem value="select">Выпадающий список</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Название для пользователя</Label>
                        <Input
                          placeholder="например: Количество сеансов"
                          value={newVariable.label || ""}
                          onChange={(e) => setNewVariable({ ...newVariable, label: e.target.value })}
                        />
                      </div>
                      
                      {(newVariable.type === "slider" || newVariable.type === "number") && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Мин</Label>
                            <Input
                              type="number"
                              value={newVariable.min || 1}
                              onChange={(e) => setNewVariable({ ...newVariable, min: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Макс</Label>
                            <Input
                              type="number"
                              value={newVariable.max || 100}
                              onChange={(e) => setNewVariable({ ...newVariable, max: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Шаг</Label>
                            <Input
                              type="number"
                              value={newVariable.step || 1}
                              onChange={(e) => setNewVariable({ ...newVariable, step: Number(e.target.value) })}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Значение по умолчанию</Label>
                          <Input
                            type="number"
                            value={newVariable.defaultValue || 1}
                            onChange={(e) => setNewVariable({ ...newVariable, defaultValue: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Единица измерения</Label>
                          <Input
                            placeholder="см, шт, ч..."
                            value={newVariable.unit || ""}
                            onChange={(e) => setNewVariable({ ...newVariable, unit: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Отмена</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleAddVariable}>Добавить</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                  Используйте переменные: {calculatorConfig.variables.map(v => v.name).join(", ")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3 font-mono">
                  <span className="text-muted-foreground">Цена =</span>
                  <Input
                    className="border-0 bg-transparent font-mono focus-visible:ring-0"
                    value={calculatorConfig.formula}
                    onChange={(e) => setCalculatorConfig(prev => ({ ...prev, formula: e.target.value }))}
                    placeholder="(a * 500 * b * c)"
                  />
                </div>
                
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-2">Поддерживаемые операции:</p>
                  <div className="flex flex-wrap gap-2">
                    {["+", "-", "*", "/", "(", ")", "^"].map(op => (
                      <Badge key={op} variant="outline" className="font-mono">{op}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm text-muted-foreground">Предпросмотр (с дефолтными значениями):</span>
                  <span className="text-lg font-bold">
                    ≈ {previewPrice().toLocaleString("ru-RU")} {calculatorConfig.currency}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Label>Валюта</Label>
                  <Select
                    value={calculatorConfig.currency}
                    onValueChange={(v) => setCalculatorConfig(prev => ({ ...prev, currency: v }))}
                  >
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
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Отмена</Button>
          </SheetClose>
          <Button onClick={handleSave} className="gap-2">
            <Save className="size-4" />
            Сохранить
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
