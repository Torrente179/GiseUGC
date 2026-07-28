# Components Index

Every React component file under `src/components/` has a generated forensic page here. The pages include source path, dependencies, reverse dependencies, exports, local functions, coupling notes, and maintenance checkpoints.

## Summary Table
| Component file | Layer | Imports | Imported by | Risk |
| --- | --- | ---: | ---: | --- |
| [src/components/Contact.tsx](components-contact.md) | Homepage Composition | 1 | 0 | Low |
| [src/components/CreatorAdvantage.tsx](components-creatoradvantage.md) | Homepage Composition | 7 | 1 | Medium |
| [src/components/DesktopFiverrRatingSection.tsx](components-desktopfiverrratingsection.md) | Homepage Composition | 1 | 0 | Low |
| [src/components/FAQ.tsx](components-faq.md) | Homepage Composition | 5 | 0 | Low |
| [src/components/FiverrRatingCard.tsx](components-fiverrratingcard.md) | Homepage Composition | 0 | 2 | Medium |
| [src/components/FloatingContactDock.tsx](components-floatingcontactdock.md) | Homepage Composition | 2 | 0 | Low |
| [src/components/Footer.tsx](components-footer.md) | Homepage Composition | 1 | 1 | Medium |
| [src/components/Hero.tsx](components-hero.md) | Homepage Composition | 8 | 1 | Medium |
| [src/components/HeroIntroduction.tsx](components-herointroduction.md) | Homepage Composition | 2 | 0 | Low |
| [src/components/HeroWallTile.tsx](components-herowalltile.md) | Homepage Composition | 1 | 1 | Medium |
| [src/components/LegalPage.tsx](components-legalpage.md) | Dynamic Page Factories | 6 | 0 | Low |
| [src/components/media/AutoplayPreviewVideo.tsx](components-media-autoplaypreviewvideo.md) | Media and Video System | 0 | 2 | Medium |
| [src/components/media/LazyVideo.tsx](components-media-lazyvideo.md) | Media and Video System | 0 | 3 | Medium |
| [src/components/media/TheaterVideo.tsx](components-media-theatervideo.md) | Media and Video System | 1 | 2 | Medium |
| [src/components/MobileContactCtaSection.tsx](components-mobilecontactctasection.md) | Homepage Composition | 1 | 0 | Low |
| [src/components/MobileFiverrRatingSection.tsx](components-mobilefiverrratingsection.md) | Homepage Composition | 1 | 0 | Low |
| [src/components/motion/FadeInOnMount.tsx](components-motion-fadeinonmount.md) | Motion and Design System | 0 | 1 | Medium |
| [src/components/motion/LiteSplitTextReveal.tsx](components-motion-litesplittextreveal.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/motion/PretextLineReveal.tsx](components-motion-pretextlinereveal.md) | Motion and Design System | 1 | 5 | High |
| [src/components/motion/SectionReveal.tsx](components-motion-sectionreveal.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/motion/SectionSkeleton.tsx](components-motion-sectionskeleton.md) | Motion and Design System | 0 | 1 | Medium |
| [src/components/motion/SplitTextReveal.tsx](components-motion-splittextreveal.md) | Motion and Design System | 2 | 4 | High |
| [src/components/Navbar.tsx](components-navbar.md) | Homepage Composition | 5 | 5 | High |
| [src/components/NavbarControls.tsx](components-navbarcontrols.md) | Homepage Composition | 3 | 1 | Medium |
| [src/components/PageEndStrip.tsx](components-pageendstrip.md) | Homepage Composition | 2 | 1 | Medium |
| [src/components/PageSeo.tsx](components-pageseo.md) | SEO, Static Assets, and Deployment | 0 | 5 | High |
| [src/components/Portfolio.tsx](components-portfolio.md) | Homepage Composition | 7 | 1 lazy | Medium |
| [src/components/ResourcePage.tsx](components-resourcepage.md) | Dynamic Page Factories | 7 | 0 | Low |
| [src/components/ServiceLandingPage.tsx](components-servicelandingpage.md) | Dynamic Page Factories | 11 | 0 | Low |
| [src/components/Services.tsx](components-services.md) | Homepage Composition | 4 | 0 | Low |
| [src/components/ServicesMarquee.tsx](components-servicesmarquee.md) | Homepage Composition | 3 | 0 | Low |
| [src/components/SiteFooter.tsx](components-sitefooter.md) | Homepage Composition | 2 | 5 | High |
| [src/components/SocialProof.tsx](components-socialproof.md) | Homepage Composition | 1 | 0 | Low |
| [src/components/Testimonials.tsx](components-testimonials.md) | Homepage Composition | 2 | 0 | Low |
| [src/components/ThemeRuntimeSync.tsx](components-themeruntimesync.md) | Bootstrap and Providers | 0 | 1 | Medium |
| [src/components/ThemeToggle.tsx](components-themetoggle.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/ui/accordion.tsx](components-ui-accordion.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/ui/alert-dialog.tsx](components-ui-alert-dialog.md) | Motion and Design System | 2 | 0 | Low |
| [src/components/ui/alert.tsx](components-ui-alert.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/aspect-ratio.tsx](components-ui-aspect-ratio.md) | Motion and Design System | 0 | 0 | Low |
| [src/components/ui/avatar.tsx](components-ui-avatar.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/badge.tsx](components-ui-badge.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/breadcrumb.tsx](components-ui-breadcrumb.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/button.tsx](components-ui-button.md) | Motion and Design System | 1 | 5 | Medium |
| [src/components/ui/calendar.tsx](components-ui-calendar.md) | Motion and Design System | 2 | 0 | Low |
| [src/components/ui/card.tsx](components-ui-card.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/carousel.tsx](components-ui-carousel.md) | Motion and Design System | 2 | 0 | Low |
| [src/components/ui/chart.tsx](components-ui-chart.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/checkbox.tsx](components-ui-checkbox.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/collapsible.tsx](components-ui-collapsible.md) | Motion and Design System | 0 | 0 | Low |
| [src/components/ui/command.tsx](components-ui-command.md) | Motion and Design System | 2 | 0 | Low |
| [src/components/ui/context-menu.tsx](components-ui-context-menu.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/dialog.tsx](components-ui-dialog.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/ui/drawer.tsx](components-ui-drawer.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/dropdown-menu.tsx](components-ui-dropdown-menu.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/form.tsx](components-ui-form.md) | Motion and Design System | 2 | 0 | Low |
| [src/components/ui/hover-card.tsx](components-ui-hover-card.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/input-otp.tsx](components-ui-input-otp.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/input.tsx](components-ui-input.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/ui/label.tsx](components-ui-label.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/ui/menubar.tsx](components-ui-menubar.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/navigation-menu.tsx](components-ui-navigation-menu.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/pagination.tsx](components-ui-pagination.md) | Motion and Design System | 2 | 0 | Low |
| [src/components/ui/popover.tsx](components-ui-popover.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/progress.tsx](components-ui-progress.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/radio-group.tsx](components-ui-radio-group.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/resizable.tsx](components-ui-resizable.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/scroll-area.tsx](components-ui-scroll-area.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/select.tsx](components-ui-select.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/separator.tsx](components-ui-separator.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/ui/sheet.tsx](components-ui-sheet.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/ui/sidebar.tsx](components-ui-sidebar.md) | Motion and Design System | 8 | 0 | Low |
| [src/components/ui/skeleton.tsx](components-ui-skeleton.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/ui/slider.tsx](components-ui-slider.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/sonner.tsx](components-ui-sonner.md) | Motion and Design System | 0 | 0 | Low |
| [src/components/ui/switch.tsx](components-ui-switch.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/table.tsx](components-ui-table.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/tabs.tsx](components-ui-tabs.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/textarea.tsx](components-ui-textarea.md) | Motion and Design System | 1 | 0 | Low |
| [src/components/ui/toast.tsx](components-ui-toast.md) | Motion and Design System | 1 | 2 | Medium |
| [src/components/ui/toaster.tsx](components-ui-toaster.md) | Motion and Design System | 2 | 0 | Low |
| [src/components/ui/toggle-group.tsx](components-ui-toggle-group.md) | Motion and Design System | 2 | 0 | Low |
| [src/components/ui/toggle.tsx](components-ui-toggle.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/ui/tooltip.tsx](components-ui-tooltip.md) | Motion and Design System | 1 | 1 | Medium |
| [src/components/VerticalLandingPage.tsx](components-verticallandingpage.md) | Dynamic Page Factories | 10 | 0 | Low |

## Top-Level Website Components
- [src/components/Contact.tsx](components-contact.md)
- [src/components/CreatorAdvantage.tsx](components-creatoradvantage.md)
- [src/components/DesktopFiverrRatingSection.tsx](components-desktopfiverrratingsection.md)
- [src/components/FAQ.tsx](components-faq.md)
- [src/components/FiverrRatingCard.tsx](components-fiverrratingcard.md)
- [src/components/FloatingContactDock.tsx](components-floatingcontactdock.md)
- [src/components/Footer.tsx](components-footer.md)
- [src/components/Hero.tsx](components-hero.md)
- [src/components/HeroIntroduction.tsx](components-herointroduction.md)
- [src/components/HeroWallTile.tsx](components-herowalltile.md)
- [src/components/LegalPage.tsx](components-legalpage.md)
- [src/components/media/AutoplayPreviewVideo.tsx](components-media-autoplaypreviewvideo.md)
- [src/components/media/LazyVideo.tsx](components-media-lazyvideo.md)
- [src/components/media/TheaterVideo.tsx](components-media-theatervideo.md)
- [src/components/MobileContactCtaSection.tsx](components-mobilecontactctasection.md)
- [src/components/MobileFiverrRatingSection.tsx](components-mobilefiverrratingsection.md)
- [src/components/motion/FadeInOnMount.tsx](components-motion-fadeinonmount.md)
- [src/components/motion/LiteSplitTextReveal.tsx](components-motion-litesplittextreveal.md)
- [src/components/motion/PretextLineReveal.tsx](components-motion-pretextlinereveal.md)
- [src/components/motion/SectionReveal.tsx](components-motion-sectionreveal.md)
- [src/components/motion/SectionSkeleton.tsx](components-motion-sectionskeleton.md)
- [src/components/motion/SplitTextReveal.tsx](components-motion-splittextreveal.md)
- [src/components/Navbar.tsx](components-navbar.md)
- [src/components/NavbarControls.tsx](components-navbarcontrols.md)
- [src/components/PageEndStrip.tsx](components-pageendstrip.md)
- [src/components/PageSeo.tsx](components-pageseo.md)
- [src/components/Portfolio.tsx](components-portfolio.md)
- [src/components/ResourcePage.tsx](components-resourcepage.md)
- [src/components/ServiceLandingPage.tsx](components-servicelandingpage.md)
- [src/components/Services.tsx](components-services.md)
- [src/components/ServicesMarquee.tsx](components-servicesmarquee.md)
- [src/components/SiteFooter.tsx](components-sitefooter.md)
- [src/components/SocialProof.tsx](components-socialproof.md)
- [src/components/Testimonials.tsx](components-testimonials.md)
- [src/components/ThemeRuntimeSync.tsx](components-themeruntimesync.md)
- [src/components/ThemeToggle.tsx](components-themetoggle.md)
- [src/components/VerticalLandingPage.tsx](components-verticallandingpage.md)

## UI Primitives
- [src/components/ui/accordion.tsx](components-ui-accordion.md)
- [src/components/ui/alert-dialog.tsx](components-ui-alert-dialog.md)
- [src/components/ui/alert.tsx](components-ui-alert.md)
- [src/components/ui/aspect-ratio.tsx](components-ui-aspect-ratio.md)
- [src/components/ui/avatar.tsx](components-ui-avatar.md)
- [src/components/ui/badge.tsx](components-ui-badge.md)
- [src/components/ui/breadcrumb.tsx](components-ui-breadcrumb.md)
- [src/components/ui/button.tsx](components-ui-button.md)
- [src/components/ui/calendar.tsx](components-ui-calendar.md)
- [src/components/ui/card.tsx](components-ui-card.md)
- [src/components/ui/carousel.tsx](components-ui-carousel.md)
- [src/components/ui/chart.tsx](components-ui-chart.md)
- [src/components/ui/checkbox.tsx](components-ui-checkbox.md)
- [src/components/ui/collapsible.tsx](components-ui-collapsible.md)
- [src/components/ui/command.tsx](components-ui-command.md)
- [src/components/ui/context-menu.tsx](components-ui-context-menu.md)
- [src/components/ui/dialog.tsx](components-ui-dialog.md)
- [src/components/ui/drawer.tsx](components-ui-drawer.md)
- [src/components/ui/dropdown-menu.tsx](components-ui-dropdown-menu.md)
- [src/components/ui/form.tsx](components-ui-form.md)
- [src/components/ui/hover-card.tsx](components-ui-hover-card.md)
- [src/components/ui/input-otp.tsx](components-ui-input-otp.md)
- [src/components/ui/input.tsx](components-ui-input.md)
- [src/components/ui/label.tsx](components-ui-label.md)
- [src/components/ui/menubar.tsx](components-ui-menubar.md)
- [src/components/ui/navigation-menu.tsx](components-ui-navigation-menu.md)
- [src/components/ui/pagination.tsx](components-ui-pagination.md)
- [src/components/ui/popover.tsx](components-ui-popover.md)
- [src/components/ui/progress.tsx](components-ui-progress.md)
- [src/components/ui/radio-group.tsx](components-ui-radio-group.md)
- [src/components/ui/resizable.tsx](components-ui-resizable.md)
- [src/components/ui/scroll-area.tsx](components-ui-scroll-area.md)
- [src/components/ui/select.tsx](components-ui-select.md)
- [src/components/ui/separator.tsx](components-ui-separator.md)
- [src/components/ui/sheet.tsx](components-ui-sheet.md)
- [src/components/ui/sidebar.tsx](components-ui-sidebar.md)
- [src/components/ui/skeleton.tsx](components-ui-skeleton.md)
- [src/components/ui/slider.tsx](components-ui-slider.md)
- [src/components/ui/sonner.tsx](components-ui-sonner.md)
- [src/components/ui/switch.tsx](components-ui-switch.md)
- [src/components/ui/table.tsx](components-ui-table.md)
- [src/components/ui/tabs.tsx](components-ui-tabs.md)
- [src/components/ui/textarea.tsx](components-ui-textarea.md)
- [src/components/ui/toast.tsx](components-ui-toast.md)
- [src/components/ui/toaster.tsx](components-ui-toaster.md)
- [src/components/ui/toggle-group.tsx](components-ui-toggle-group.md)
- [src/components/ui/toggle.tsx](components-ui-toggle.md)
- [src/components/ui/tooltip.tsx](components-ui-tooltip.md)
