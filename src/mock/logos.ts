import logoLinks from "@/assets/logo-myzveno-links.png";
import logoKnot from "@/assets/logo-myzveno-knot.png";
import logoLettering from "@/assets/logo-myzveno-lettering.png";
import logoNodes from "@/assets/logo-myzveno-nodes.png";
import twoLinksMaster from "@/assets/logo-two-links-master.png";
import twoLinksSymbol from "@/assets/logo-two-links-symbol.png";
import couplingJoined from "@/assets/logo-coupling-refined-joined.png";
import couplingSeparated from "@/assets/logo-coupling-refined-separated.png";
import couplingSymbol from "@/assets/logo-coupling-refined-symbol.png";
import mJoined from "@/assets/logo-m-monogram-refined-joined.png";
import mSeparated from "@/assets/logo-m-monogram-refined-separated.png";
import mSymbol from "@/assets/logo-m-monogram-refined-symbol.png";
import zJoined from "@/assets/logo-z-monogram-refined-joined.png";
import zSeparated from "@/assets/logo-z-monogram-refined-separated.png";
import zSymbol from "@/assets/logo-z-monogram-refined-symbol.png";
import coreJoined from "@/assets/logo-shared-core-refined-joined.png";
import coreSeparated from "@/assets/logo-shared-core-refined-separated.png";
import coreSymbol from "@/assets/logo-shared-core-refined-symbol.png";
import ribbonsJoined from "@/assets/logo-interwoven-refined-joined.png";
import ribbonsSeparated from "@/assets/logo-interwoven-refined-separated.png";
import ribbonsSymbol from "@/assets/logo-interwoven-refined-symbol.png";

export type Concept = {
  name: string;
  idea: string;
  where: string;
  src: string;
  width: number;
  height: number;
  wide: boolean;
};

export const originalConcepts: Concept[] = [
  { name: "Два звена", idea: "Сцепленные звенья одной линией: задачи и проекты связаны в одну цепь. Горизонтальная композиция.", where: "Шапка сайта, подпись в письмах, любые узкие места.", src: logoLinks, width: 976, height: 301, wide: true },
  { name: "Звено-«З»", idea: "Квадратное звено, которое читается как буква «З». Знак над названием, компактный.", where: "Иконка приложения, favicon, аватар в соцсетях.", src: logoKnot, width: 898, height: 906, wide: false },
  { name: "Леттеринг", idea: "Только название: буква «З» нарисована открытым звеном внутри слова. Без отдельного знака.", where: "Горизонтальные места, где знак уже не нужен: футер, документы.", src: logoLettering, width: 993, height: 235, wide: true },
  { name: "Цепочка узлов", idea: "Три узла на одной линии — цепочка связанных задач. Средний узел выделен спокойным синим.", where: "Шапка сайта, экран входа, презентации.", src: logoNodes, width: 1029, height: 239, wide: true },
];

export const referenceLogo = {
  name: "Два звена",
  wordmark: "МоёЗвено",
  description: "Сцепленные звенья одной линией: задачи и проекты связаны в одну цепь. Горизонтальная композиция.",
  lockup: { src: twoLinksMaster, width: 1792, height: 326 },
  symbol: { src: twoLinksSymbol, width: 573, height: 326 },
};

export type LogoStudy = {
  id: string;
  name: string;
  description: string;
  joined: string;
  separated: string;
  symbol: string;
};

export const logoStudies: LogoStudy[] = [
  { id: "01", name: "Сцепление", description: "Два встречных звена соединяются, сохраняя просвет. Связывают личные дела и командную работу в одном знаке.", joined: couplingJoined, separated: couplingSeparated, symbol: couplingSymbol },
  { id: "02", name: "Монограмма М", description: "Мягкая буква М складывается в цельный силуэт. Опирается на русское название и узнаётся без подписи.", joined: mJoined, separated: mSeparated, symbol: mSymbol },
  { id: "03", name: "Монограмма Z", description: "Две горизонтали соединены диагональю в букву Z. Отсылает к zveno в домене myzveno.ru.", joined: zJoined, separated: zSeparated, symbol: zSymbol },
  { id: "04", name: "Общее ядро", description: "Четыре блока собраны вокруг открытого центра. Показывают задачи и проекты в общем пространстве.", joined: coreJoined, separated: coreSeparated, symbol: coreSymbol },
  { id: "05", name: "Переплетение", description: "Две ленты сходятся в силуэт, похожий на М. Передают совместную работу, оставаясь различимыми в одном цвете.", joined: ribbonsJoined, separated: ribbonsSeparated, symbol: ribbonsSymbol },
];