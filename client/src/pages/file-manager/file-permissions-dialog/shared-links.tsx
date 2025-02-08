import { Loader2, Trash2, Link2Off, Copy } from 'lucide-react';
import React from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from '../../../components/ui';
import {
  useFileSharedLinks,
  useRevokeShareLink,
  handleResponseErrorMessage,
} from '../../../services/apis';
import { toast } from '../../../hooks';
import { TimeFormatter } from '../../../lib/utils';

type ShareLinksProps = {
  fileId: string;
};

export const SharedLinks = ({ fileId }: ShareLinksProps) => {
  const {
    data: linksResponse,
    isLoading,
    refetch: refetchLinks,
  } = useFileSharedLinks(fileId);
  const { mutate: revokeLink } = useRevokeShareLink();

  const handleRevokeLink = (linkId: string) => {
    revokeLink(linkId, {
      onSuccess: () => {
        toast({
          title: 'Link revoked successfully',
        });
        refetchLinks();
      },
      onError: (error) => {
        handleResponseErrorMessage(error);
      },
    });
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/files/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied to clipboard',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const hasLinks = linksResponse?.data && linksResponse.data.length > 0;

  return (
    <div className="flex h-[300px] flex-col">
      <div className="flex-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link ID</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableBody>
            {!hasLinks ? (
              <TableRow>
                <TableCell colSpan={3} className="h-[200px]">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Link2Off className="size-8" />
                    <p>No shared links found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              linksResponse.data.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="flex items-center gap-2 whitespace-nowrap font-mono">
                    {link.slug}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => handleCopyLink(link.slug)}
                    >
                      <Tooltip>
                        <TooltipTrigger>
                          <Copy className="size-3" />
                        </TooltipTrigger>
                        <TooltipContent>Copy link</TooltipContent>
                      </Tooltip>
                    </Button>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {TimeFormatter.formatDateTime(link.expiresAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRevokeLink(link.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
