import { Languages } from 'lucide-react';
import { Button } from '@/components/custom/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/i18n/I18nContext';
import { LANGUAGES, Language } from '@/i18n/translations';

export default function LanguageSwitcher() {
    const { lang, setLang } = useI18n();
    const current = LANGUAGES.find((l) => l.code === lang);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline">{current?.native || lang.toUpperCase()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {LANGUAGES.map((l) => (
                    <DropdownMenuItem
                        key={l.code}
                        onClick={() => setLang(l.code as Language)}
                        className={lang === l.code ? 'font-semibold bg-accent' : ''}
                    >
                        <span className="mr-2">{l.native}</span>
                        <span className="text-xs text-muted-foreground">{l.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
