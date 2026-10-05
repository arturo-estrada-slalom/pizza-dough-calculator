import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";
import {
  HeaderRoot,
  LanguageSelectorWrapper,
  TitleRow,
  IconBadge,
  Title,
  Subtitle,
} from "./AppHeader.styled";

export function AppHeader() {
  const { t } = useTranslation();

  return (
    <HeaderRoot>
      <LanguageSelectorWrapper>
        <LanguageSelector />
      </LanguageSelectorWrapper>
      <TitleRow>
        <IconBadge aria-hidden="true">🍕</IconBadge>
        <Title variant="h1">{t("app.title")}</Title>
      </TitleRow>
      <Subtitle variant="subtitle1">{t("app.subtitle")}</Subtitle>
    </HeaderRoot>
  );
}
