"use client"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addCharacter } from "@/lib/api"
import { getAllPeople, getEntities } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ChevronsUpDown, Loader2, Plus, Command as CommandIcon } from "lucide-react"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
} from "@/components/ui/command"

//  Type definition for props
interface SearchSelectProps {
    label: string
    options: { _id: string; name?: string; title?: string }[] 
    value: string
    onChange: (value: string) => void
    placeholder: string
    isLoading?: boolean
}

//  Reusable searchable dropdown component
function SearchSelect({ label, options, value, onChange, placeholder, isLoading }: SearchSelectProps) {
    const selected = options.find((o: any) => o._id === value)

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between")}
                    >
                        {isLoading
                            ? "Loading..."
                            : selected
                                ? selected.name || selected.title 
                                : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-3">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    ) : (
                        <Command>
                            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                            <CommandList>
                                {options.length > 0 ? (
                                    options.map((opt: any) => (
                                        <CommandItem
                                            key={opt._id}
                                            onSelect={() => onChange(opt._id)}
                                        >
                                            {opt.name || opt.title} 
                                        </CommandItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        No {label.toLowerCase()} found
                                    </div>
                                )}
                            </CommandList>
                        </Command>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default function AddCharacter() {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        name: "",
        description: "",
        actor: "",
        entity: "",
    })
    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationFn: addCharacter,
        onSuccess: () => {
            toast.success("Character added successfully!")
            queryClient.invalidateQueries({ queryKey: ["characters"] })
            setForm({ name: "", description: "", actor: "", entity: "" })
            setOpen(false)
        },
        onError: () => {
            toast.error("Failed to add character.")
        },
    })
    // fetch people
    const { data: actorsData = [], isLoading: actorsLoading } = useQuery({
        queryKey: ["people"],
        queryFn: getAllPeople,

    })
    // fetch entities 
    const { data: entitiesData = [], isLoading: entitiesLoading } = useQuery({
        queryKey: ["entities"],
        queryFn: getEntities,
    })
    console.log("Entities data:", entitiesData)

   const actors = Array.isArray(actorsData)
  ? actorsData
  : actorsData?.people || []

    const entities = Array.isArray(entitiesData)
        ? entitiesData
        : entitiesData?.entities || []




    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
          console.log("Submitting character form:", form)

        mutate(form)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Character
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Character</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                        />
                    </div>
                    {/*  Actor Search Dropdown */}
                    <SearchSelect
                        label="Actor"
                        options={actors}
                        value={form.actor}
                        onChange={(id) => setForm({ ...form, actor: id })}
                        placeholder="Select actor"
                        isLoading={actorsLoading}
                    />

                    {/*  Entity Search Dropdown */}
                    <SearchSelect
                        label="Entity"
                        options={entities}
                        value={form.entity}
                        onChange={(id) => setForm({ ...form, entity: id })}
                        placeholder="Select entity"
                        isLoading={entitiesLoading}
                    />
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Character"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
