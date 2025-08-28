import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileSummary({ name = "User", title = "Your title", avatar }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-white shadow">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.slice(0,2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{name}</div>
          <div className="text-xs text-muted-foreground truncate">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
