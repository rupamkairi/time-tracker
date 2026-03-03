import { useParams, Link } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Timer,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function LogDetail() {
  const { logId } = useParams();
  const id = Number(logId);

  const { data: log, isLoading } = trpc.taskLog.getById.useQuery(
    { id },
    {
      enabled: !!id,
    },
  );

  if (isLoading)
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <Card className="animate-pulse h-48" />
        <Card className="animate-pulse h-64" />
      </div>
    );

  if (!log)
    return (
      <div className="text-center py-20 text-destructive font-medium">
        Log entry not found
      </div>
    );

  const duration =
    log.startTime && log.endTime
      ? (new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) /
        (1000 * 60)
      : 0;

  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link to="/calendar">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Calendar
        </Button>
      </Link>

      <Card>
        <CardHeader className="space-y-4">
          <div className="space-y-1">
            {log.task && (
              <Link to={`/projects/${log.task.projectId}`}>
                <Badge
                  variant="secondary"
                  className="hover:bg-secondary/80 transition-colors mb-2"
                >
                  Task: {log.task.title}
                </Badge>
              </Link>
            )}
            <CardTitle className="text-3xl font-bold tracking-tight">
              {log.title}
            </CardTitle>
            {log.description && (
              <CardDescription className="text-lg mt-2">
                {log.description}
              </CardDescription>
            )}
          </div>

          <Separator />

          <div className="flex flex-wrap items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground font-medium block text-xs uppercase tracking-wider">
                  Date
                </span>
                <span className="font-semibold">{log.logDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground font-medium block text-xs uppercase tracking-wider">
                  Time
                </span>
                <span className="font-semibold">
                  {log.startTime
                    ? new Date(log.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--"}{" "}
                  -
                  {log.endTime
                    ? new Date(log.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground font-medium block text-xs uppercase tracking-wider">
                  Duration
                </span>
                <span className="font-semibold">
                  {hours}h {minutes}m
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Details & Notes
          </h2>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Detail
          </Button>
        </div>

        {log.details && log.details.length > 0 ? (
          log.details.map((detail) => (
            <Card key={detail.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {detail.content || ""}
                  </Markdown>
                </div>

                {detail.links && detail.links.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                      Related Links
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {detail.links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-sm font-medium transition-colors border group"
                        >
                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                          {link.title || link.url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4 font-medium">
                No details added yet.
              </p>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add your first detail
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
