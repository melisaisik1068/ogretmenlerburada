export type GradeGroup = { title: string; items: Array<{ label: string; href: string }> };

export function buildGradeGroups(t: (path: string) => string): GradeGroup[] {
  return [
    {
      title: t("nav.sectionPrimary"),
      items: [
        { label: t("nav.class1"), href: "/classes" },
        { label: t("nav.class2"), href: "/classes" },
        { label: t("nav.class3"), href: "/classes" },
        { label: t("nav.class4"), href: "/classes" },
      ],
    },
    {
      title: t("nav.sectionMiddle"),
      items: [
        { label: t("nav.class5"), href: "/classes" },
        { label: t("nav.class6"), href: "/classes" },
        { label: t("nav.class7"), href: "/classes" },
        { label: t("nav.class8"), href: "/classes" },
      ],
    },
    {
      title: t("nav.sectionHigh"),
      items: [
        { label: t("nav.class9"), href: "/classes" },
        { label: t("nav.class10"), href: "/classes" },
        { label: t("nav.class11"), href: "/classes" },
        { label: t("nav.class12"), href: "/classes" },
      ],
    },
  ];
}
