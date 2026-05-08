export type GradeGroup = { title: string; items: Array<{ label: string; href: string }> };

export function buildGradeGroups(t: (path: string) => string): GradeGroup[] {
  return [
    {
      title: t("nav.sectionPrimary"),
      items: [
        { label: t("nav.class1"), href: "/classes?grade=1" },
        { label: t("nav.class2"), href: "/classes?grade=2" },
        { label: t("nav.class3"), href: "/classes?grade=3" },
        { label: t("nav.class4"), href: "/classes?grade=4" },
      ],
    },
    {
      title: t("nav.sectionMiddle"),
      items: [
        { label: t("nav.class5"), href: "/classes?grade=5" },
        { label: t("nav.class6"), href: "/classes?grade=6" },
        { label: t("nav.class7"), href: "/classes?grade=7" },
        { label: t("nav.class8"), href: "/classes?grade=8" },
      ],
    },
    {
      title: t("nav.sectionHigh"),
      items: [
        { label: t("nav.class9"), href: "/classes?grade=9" },
        { label: t("nav.class10"), href: "/classes?grade=10" },
        { label: t("nav.class11"), href: "/classes?grade=11" },
        { label: t("nav.class12"), href: "/classes?grade=12" },
      ],
    },
  ];
}
