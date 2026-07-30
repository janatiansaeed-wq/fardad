export type PresentationCategory = Readonly<{
  title: string;
  description: string;
  image: string;
  imagePosition: string;
}>;

export type PresentationShowcaseItem = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imagePosition: string;
}>;

export const fardadHomePresentation = {
  categories: [
    {
      title: "فیروزه‌کوبی",
      description: "درخشش سنگ فیروزه در کنار فلز؛ روایتی چشمگیر برای هدیه‌ای ماندگار.",
      image: "/images/presentation/turquoise-enamel-presentation.png",
      imagePosition: "45% 38%",
    },
    {
      title: "میناکاری",
      description: "نقش و رنگ ایرانی در ترکیبی آرام، ظریف و مناسب چیدمان‌های هدیه‌محور.",
      image: "/images/presentation/turquoise-enamel-presentation.png",
      imagePosition: "70% 76%",
    },
    {
      title: "خاتم‌کاری",
      description: "هندسه‌ای صبورانه از چوب و فلز برای انتخاب‌هایی با شخصیت کلاسیک.",
      image: "/images/presentation/marquetry-metal-presentation.png",
      imagePosition: "26% 78%",
    },
    {
      title: "قلمزنی",
      description: "سطوح فلزی و نقش‌های دست‌پرداخته؛ مناسب روایت‌های رسمی و اصیل.",
      image: "/images/presentation/marquetry-metal-presentation.png",
      imagePosition: "72% 34%",
    },
    {
      title: "هدایای مدیریتی",
      description: "چیدمان سنجیده برای مناسبت‌های سازمانی، با امکان تعریف روایت و ارائه.",
      image: "/images/presentation/corporate-gifting-presentation.png",
      imagePosition: "54% 58%",
    },
    {
      title: "پک‌های هدیه",
      description: "ترکیب چند عنصر هنری در ارائه‌ای هماهنگ، گرم و شایسته هدیه‌دادن.",
      image: "/images/presentation/corporate-gifting-presentation.png",
      imagePosition: "50% 68%",
    },
  ] satisfies readonly PresentationCategory[],
  showcase: {
    eyebrow: "منتخب ویترین فرداد",
    title: "سه روایت برای یک انتخاب متفاوت",
    description:
      "این کارت‌ها ویترین تصویری نسخه نمایشی‌اند و موجودی یا محصول قطعی را نشان نمی‌دهند.",
    items: [
      {
        eyebrow: "روایت رنگ و فلز",
        title: "آبیِ ایرانی",
        description:
          "ترکیبی نمایشی از فیروزه و مینا برای هدیه‌ای با حضور رنگ، جزئیات و اصالت بصری.",
        image: "/images/presentation/turquoise-enamel-presentation.png",
        imagePosition: "50% 52%",
      },
      {
        eyebrow: "روایت هندسه و نقش",
        title: "جزئیات ماندگار",
        description:
          "چیدمانی نمایشی از خاتم و قلمزنی برای موقعیت‌هایی که وقار و ظرافت اهمیت دارد.",
        image: "/images/presentation/marquetry-metal-presentation.png",
        imagePosition: "50% 56%",
      },
      {
        eyebrow: "روایت هدیه سازمانی",
        title: "ارائه‌ای هماهنگ",
        description:
          "تصویری پیشنهادی از بسته‌بندی و انتخاب چندلایه برای شروع گفت‌وگوی سفارش سازمانی.",
        image: "/images/presentation/corporate-gifting-presentation.png",
        imagePosition: "50% 62%",
      },
    ] satisfies readonly PresentationShowcaseItem[],
  },
  corporate: {
    eyebrow: "هدیه سازمانی و سفارش اختصاصی",
    title: "از یک مناسبت، به یک روایت به‌یادماندنی",
    description:
      "برای سفارش‌های سازمانی می‌توان مسیر انتخاب، ترکیب هدیه و شیوه ارائه را متناسب با مناسبت و هویت مجموعه تعریف کرد.",
    points: ["انتخاب بر اساس موقعیت و مخاطب", "چیدمان و ارائه هماهنگ", "مسیر پیشنهادی برای شخصی‌سازی"],
    image: "/images/presentation/corporate-gifting-presentation.png",
  },
  editorial: {
    eyebrow: "دفتر فرداد",
    title: "هنر را فقط نبینیم؛ داستانش را بخوانیم",
    description:
      "سه یادداشت کوتاه برای شناخت بهتر زبان فرم، هدیه‌دادن و پیوند صنایع دستی با زندگی امروز.",
    items: [
      {
        label: "راهنمای انتخاب",
        title: "هدیه‌ای متناسب با شأن موقعیت",
        description: "چطور پیش از انتخاب، مخاطب، مناسبت و لحن هدیه را کنار هم ببینیم.",
      },
      {
        label: "شناخت هنر",
        title: "وقتی جزئیات، ارزش روایت را می‌سازند",
        description: "نگاهی کوتاه به نقش بافت، تکرار و مهارت در تجربه یک اثر دست‌ساز.",
      },
      {
        label: "سازمانی",
        title: "از بسته‌بندی تا لحظه ارائه",
        description: "چرا هماهنگی میان انتخاب، پیام و ارائه در هدیه‌های سازمانی مهم است.",
      },
    ],
  },
} as const;
