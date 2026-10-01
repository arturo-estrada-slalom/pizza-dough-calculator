import {
  HeaderRoot,
  TitleRow,
  IconBadge,
  Title,
  Subtitle,
} from "./AppHeader.styled";

export function AppHeader() {
  return (
    <HeaderRoot>
      <TitleRow>
        <IconBadge aria-hidden="true">🍕</IconBadge>
        <Title variant="h1">Pizza Dough Calculator</Title>
      </TitleRow>
      <Subtitle variant="subtitle1" color="text.secondary">
        Baker's percentages for home & professional use
      </Subtitle>
    </HeaderRoot>
  );
}
