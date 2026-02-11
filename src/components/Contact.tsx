
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define Zod schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  website: z.string().optional(),
});

// Infer the type from the schema
type ContactFormData = z.infer<typeof formSchema>;

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  // Rate limiting - cooldown after submission
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Define the submit handler function
  const onSubmit = (data: ContactFormData) => {
    // Honeypot check - bots will fill this hidden field
    if (data.website) {
      console.log('Bot detected - honeypot triggered');
      return Promise.resolve(); // Silently fail for bots
    }

    // Rate limiting check
    if (cooldown) {
      return Promise.resolve();
    }

    console.log("Form Data Submitted:", data);
    return new Promise(resolve => {
      setTimeout(() => {
        toast({
          title: t('contact.toast.successTitle'),
          description: t('contact.toast.successDescription'),
          duration: 5000,
        });
        reset();

        // Start cooldown
        setCooldown(true);
        setCooldownTime(30);
        const interval = setInterval(() => {
          setCooldownTime(prev => {
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
    <section id="contact" className="section-padding bg-secondary/25">
      <div className="container relative z-10 mx-auto">
        <div className="text-center mb-16">
          <p className="section-label text-muted-foreground mb-3">{t('contact.sectionSubtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-[-0.04em] mb-6">{t('contact.sectionTitle')}</h2>
          <div className="w-24 h-1 signature-line mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="cafe-panel p-8 md:p-10 flex flex-col justify-center bg-card/80">
            <h3 className="text-3xl font-semibold mb-6 text-primary">{t('contact.heading')}</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {t('contact.description')}
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mr-4">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary">{t('contact.emailLabel')}</h4>
                  <p className="text-muted-foreground">{t('contact.emailValue')}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mr-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary">{t('contact.fiverrLabel')}</h4>
                  <p className="text-muted-foreground">{t('contact.fiverrValue')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cafe-panel p-8 md:p-10 bg-card/95">
            {/* Use react-hook-form's handleSubmit */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="input-glow rounded-lg">
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-primary">{t('contact.form.nameLabel')}</label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-border'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-background/80`}
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div className="input-glow rounded-lg">
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-primary">{t('contact.form.emailLabel')}</label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-border'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-background/80`}
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              {/* Honeypot field - invisible to users, bots will fill it */}
              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                {...register("website")}
              />

              <div className="input-glow rounded-lg">
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-primary">{t('contact.form.subjectLabel')}</label>
                <input
                  type="text"
                  id="subject"
                  {...register("subject")}
                  className={`w-full p-3 border ${errors.subject ? 'border-red-500' : 'border-border'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-background/80`}
                  placeholder={t('contact.form.subjectPlaceholder')}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
              </div>

              <div className="input-glow rounded-lg">
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-primary">{t('contact.form.messageLabel')}</label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={4}
                  className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-border'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none bg-background/80`}
                  placeholder={t('contact.form.messagePlaceholder')}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cooldown}
                className="w-full btn-primary-nordic py-3.5 rounded-lg flex items-center justify-center gap-2 hover-grow btn-press disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {cooldown
                  ? `${t('contact.form.submitButton')} (${cooldownTime}s)`
                  : isSubmitting
                    ? t('contact.form.submittingButton')
                    : t('contact.form.submitButton')
                }
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
