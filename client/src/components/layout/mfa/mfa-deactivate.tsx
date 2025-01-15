import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';
import {
  handleResponseErrorMessage,
  useDeactivateMFA,
} from '../../../services/apis';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../ui';

type MFADeactivateProps = {
  onDeactivationSuccess: () => void;
};

const deactivateSchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
});

type DeactivateMFAFormData = z.infer<typeof deactivateSchema>;

export const MFADeactivate: React.FC<MFADeactivateProps> = ({
  onDeactivationSuccess,
}) => {
  const { mutate: deactivate, isPending: isDeactivating } = useDeactivateMFA();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeactivateMFAFormData>({
    resolver: zodResolver(deactivateSchema),
  });

  const onSubmit = (data: DeactivateMFAFormData) => {
    deactivate(
      { method: 'app', code: data.code },
      {
        onSuccess: () => {
          onDeactivationSuccess();
        },
        onError: (error) => {
          handleResponseErrorMessage(error);
        },
      },
    );
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="my-4 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary/50 p-4 text-2xl font-bold">
          MFA is enabled
          <CheckCircle2 className="size-6 text-green-500" />
        </h2>
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="deactivate" className="rounded-lg border">
              <AccordionTrigger className="px-4 py-3 text-sm hover:bg-secondary/50">
                Deactivate MFA
              </AccordionTrigger>
              <AccordionContent className="border-t p-4">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="code">Enter Code to Deactivate</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="cursor-help text-sm text-muted-foreground">
                            ⓘ
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          Open your authenticator app to get the current code
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      {...register('code')}
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      error={errors.code?.message}
                      className="text-lg tracking-wider"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="destructive"
                    loading={isDeactivating}
                    className="w-full"
                  >
                    Deactivate MFA
                  </Button>
                </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
};
