"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPerson } from "@/lib/api";

export default function AddPersonDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    dateOfBirth: "",
    photoUrl: "",
    roles: "",
  });

  const mutation = useMutation({
    mutationFn: addPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      setOpen(false);
      setForm({
        name: "",
        bio: "",
        dateOfBirth: "",
        photoUrl: "",
        roles: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const personData = {
      name: form.name.trim(),
      bio: form.bio.trim() || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
      photoUrl: form.photoUrl.trim() || undefined,
      roles: form.roles
        ? form.roles.split(",").map((r) => r.trim())
        : [],
    };

    mutation.mutate(personData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Person</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Person</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            placeholder="Role"
            value={form.roles}
            onChange={(e) => setForm({ ...form, roles: e.target.value })}
          />

          <Input
            type="date"
            placeholder="Date of Birth"
            value={form.dateOfBirth}
            onChange={(e) =>
              setForm({ ...form, dateOfBirth: e.target.value })
            }
          />

          <Input
            placeholder="Photo URL"
            value={form.photoUrl}
            onChange={(e) =>
              setForm({ ...form, photoUrl: e.target.value })
            }
          />

          <Textarea
            placeholder="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
