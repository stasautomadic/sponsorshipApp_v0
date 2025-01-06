import { Download, Eye, Trash2 } from 'lucide-react'
import { MediaItem } from "@/types/media"
import { Button } from "@/components/ui/button"

interface MediaListProps {
  items: MediaItem[]
  onPreview: (item: MediaItem) => void
  onDownload: (item: MediaItem) => void
  onDelete: (item: MediaItem) => void
}

export function MediaList({ items, onPreview, onDownload, onDelete }: MediaListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="space-y-1">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground">
              Created {new Date(item.createdAt).toLocaleDateString()} • By {item.author}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(item)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="h-4 w-4" />
              <span className="ml-2">Preview</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(item)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Download className="h-4 w-4" />
              <span className="ml-2">Download</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span className="ml-2">Delete</span>
            </Button>
          </div>
        </div>
      ))}
      {items.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          You've reached the end of your media library
        </p>
      )}
    </div>
  )
}

