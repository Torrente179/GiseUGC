import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof formSchema>;

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      website: '',
    },
  });

  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const onSubmit = (data: ContactFormData) => {
    if (data.website) {
      return Promise.resolve();
    }

    if (cooldown) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        toast({
          title: t('contact.toast.successTitle'),
          description: t('contact.toast.successDescription'),
          duration: 5000,
        });
        reset();

        setCooldown(true);
        setCooldownTime(30);
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCooldown(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        resolve(true);
      }, 1500);
    });
  };

  return (
    <section id="contact" className="studio-section bg-secondary/16">
      <div className="studio-container">
        <div className="studio-header">
          <div>
            <p className="section-label text-muted-foreground mb-3">{t('contact.sectionSubtitle')}</p>
            <h2 className="studio-title">{t('contact.sectionTitle')}</h2>
          </div>
          <p className="studio-subtitle lg:justify-self-end">{t('contact.description')}</p>
        </div>

        <div className="studio-rule mb-10 md:mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-6 md:gap-7 max-w-6xl mx-auto">
          <aside className="studio-panel p-7 md:p-8 lg:p-9 flex flex-col justify-between">
            <div>
              <h3 className="type-marketing-display text-[1.5rem] md:text-[1.65rem] font-semibold tracking-tight-marketing mb-5 leading-[1.14]">
                {t('contact.heading')}
              </h3>
              <p className="strategic-body text-muted-foreground mb-7">{t('contact.description')}</p>

              <div className="space-y-4">
                <div className="rounded-xl border border-border/70 bg-background/55 px-4 py-3.5 flex items-center gap-3.5">
                  <span className="h-10 w-10 rounded-full border border-border/70 bg-card/90 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{t('contact.emailLabel')}</h4>
                    <p className="text-sm text-muted-foreground">{t('contact.emailValue')}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-background/55 px-4 py-3.5 flex items-center gap-3.5">
                  <span className="h-10 w-10 rounded-full border border-border/70 bg-card/90 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </span>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{t('contact.fiverrLabel')}</h4>
                    <p className="text-sm text-muted-foreground">{t('contact.fiverrValue')}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="studio-panel p-7 md:p-8 lg:p-9">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="input-glow rounded-lg">
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                    {t('contact.form.nameLabel')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-border'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-background/80`}
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div className="input-glow rounded-lg">
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                    {t('contact.form.emailLabel')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-border'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-background/80`}
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                {...register('website')}
              />

              <div className="input-glow rounded-lg">
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground">
                  {t('contact.form.subjectLabel')}
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register('subject')}
                  className={`w-full p-3 border ${errors.subject ? 'border-red-500' : 'border-border'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-background/80`}
                  placeholder={t('contact.form.subjectPlaceholder')}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
              </div>

              <div className="input-glow rounded-lg">
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                  {t('contact.form.messageLabel')}
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={5}
                  className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-border'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none bg-background/80`}
                  placeholder={t('contact.form.messagePlaceholder')}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cooldown}
                className="btn-primary-nordic btn-primary-nordic--lg w-full btn-press disabled:cursor-not-allowed disabled:opacity-70"
              >
                {cooldown
                  ? `${t('contact.form.submitButton')} (${cooldownTime}s)`
                  : isSubmitting
                    ? t('contact.form.submittingButton')
                    : t('contact.form.submitButton')}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
