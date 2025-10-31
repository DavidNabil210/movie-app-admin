"use client"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addCharacter } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

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
     function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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

                    <div>
                        <Label>Actor ID</Label>
                        <Input
                            value={form.actor}
                            onChange={(e) => setForm({ ...form, actor: e.target.value })}
                            placeholder="actor _id"
                            required
                        />
                    </div>

                    <div>
                        <Label>Entity ID</Label>
                        <Input
                            value={form.entity}
                            onChange={(e) => setForm({ ...form, entity: e.target.value })}
                            placeholder="entity _id"
                            required
                        />
                    </div>

                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Character"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
