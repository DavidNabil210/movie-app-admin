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

      <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100 rounded-lg max-w-md w-full shadow-lg p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add New Person</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-gray-800 text-gray-100 border-gray-700"
          />

          <Input
            placeholder="Role"
            value={form.roles}
            onChange={(e) => setForm({ ...form, roles: e.target.value })}
            className="bg-gray-800 text-gray-100 border-gray-700"
          />

          <Input
            type="date"
            placeholder="Date of Birth"
            value={form.dateOfBirth}
            onChange={(e) =>
              setForm({ ...form, dateOfBirth: e.target.value })
            }
            className="bg-gray-800 text-gray-100 border-gray-700"
          />

          <Input
            placeholder="Photo URL"
            value={form.photoUrl}
            onChange={(e) =>
              setForm({ ...form, photoUrl: e.target.value })
            }
            className="bg-gray-800 text-gray-100 border-gray-700"
          />

          <Textarea
            placeholder="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="bg-gray-800 text-gray-100 border-gray-700"
          />

          <DialogFooter>
            <Button type="submit"
             className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
             disabled={mutation.isPending}>
                
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
