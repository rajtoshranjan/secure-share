import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button, Input, Label } from '../../../components/ui';
import { useGenerateShareLink } from '../../../services/apis/files';
import { toast } from '../../../hooks';
import { handleResponseErrorMessage } from '../../../services/apis';
import { TimeFormatter } from '../../../lib/utils';

type ShareLinkForm = {
  expiryDate: string;
  expiryTime: string;
};

type GenerateLinkProps = {
  fileId: string;
};

const getDefaultDateTime = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(new Date().getHours());
  tomorrow.setMinutes(new Date().getMinutes());

  return {
    date: tomorrow.toISOString().split('T')[0],
    time: tomorrow.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

export const GenerateLink = ({ fileId }: GenerateLinkProps) => {
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const defaultDateTime = getDefaultDateTime();

  // Hooks.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<ShareLinkForm>({
    defaultValues: {
      expiryDate: defaultDateTime.date,
      expiryTime: defaultDateTime.time,
    },
  });

  // Effects.
  useEffect(() => {
    if (!generatedLink) return;
    handleCopyLink();
  }, [generatedLink]);

  // Queries.
  const { mutate: generateShareLink, isPending } = useGenerateShareLink();

  // Handlers.
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Link copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateLink = (data: ShareLinkForm) => {
    const localDateTime = `${data.expiryDate}T${data.expiryTime}`;
    const selectedDateTime = new Date(localDateTime);
    const now = new Date();

    if (selectedDateTime <= now) {
      setError('expiryDate', {
        type: 'manual',
        message: 'Expiry date and time must be in the future',
      });
      return;
    }

    const combinedDateTime = selectedDateTime.toISOString();

    generateShareLink(
      {
        file: fileId,
        expiresAt: combinedDateTime,
      },
      {
        onSuccess: (response) => {
          const shareUrl = `${window.location.origin}/files/${response.data.slug}`;
          setGeneratedLink(shareUrl);
        },
        onError: (error) => {
          handleResponseErrorMessage(error);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(handleGenerateLink)} className="space-y-4">
      <div className="space-y-2">
        <Label>Link Expiry</Label>
        <div className="rounded-md border border-input bg-background p-3 pt-1">
          <div className="grid grid-cols-2 gap-4">
            {/* Date Input */}
            <div className="space-y-1">
              <Label
                htmlFor="expiryDate"
                className="text-xs text-muted-foreground"
              >
                Date
              </Label>
              <Input
                id="expiryDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="bg-background"
                {...register('expiryDate', {
                  required: 'Date is required',
                })}
              />
              {errors.expiryDate && (
                <p className="text-xs text-destructive">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
            {/* Time Input */}
            <div className="space-y-1">
              <Label
                htmlFor="expiryTime"
                className="text-xs text-muted-foreground"
              >
                Time
              </Label>
              <Input
                id="expiryTime"
                type="time"
                className="bg-background"
                {...register('expiryTime', {
                  required: 'Time is required',
                })}
              />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Link will expire in{' '}
            <span className="font-medium text-foreground">
              {TimeFormatter.formatTimeToNow(
                `${watch('expiryDate')}T${watch('expiryTime')}`,
              )}
            </span>
          </div>
        </div>

        {generatedLink ? (
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium">Shareable Link</Label>
            <div className="flex items-center gap-2">
              <div className="w-full flex-1">
                <Input readOnly value={generatedLink} className=" bg-muted" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="ml-auto"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
              <Button
                type="submit"
                variant="default"
                size="icon"
                className="ml-auto"
                disabled={!watch('expiryDate') || !watch('expiryTime')}
              >
                <RefreshCw
                  className={`size-4 ${isPending ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={!watch('expiryDate') || !watch('expiryTime')}
            loading={isPending}
          >
            Generate Link
          </Button>
        )}
      </div>
    </form>
  );
};
