import React, { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Search, HelpCircle, Mail, MapPin, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { toast } from "sonner";

export default function FAQs() {
  useDocumentTitle("FAQs");
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Ordering & Payment",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, Internet Banking, and digital wallets. We ensure secure payment processing through our trusted gateways.",
        },
        {
          q: "Can I modify or cancel my order after placing it?",
          a: "Orders can only be modified or cancelled within 2 hours of placement. Since we process orders quickly to ensure fast delivery, please contact our support team immediately at Gujarathirohithkumar@gmail.com if you need to make changes.",
        },
        {
          q: "How do I know if my order was placed successfully?",
          a: "Upon successful payment, you will receive an order confirmation email containing your order ID and a summary of the items purchased. You can also view your order history in the 'My Orders' section of your account.",
        },
      ],
    },
    {
      category: "Shipping & Tracking",
      icon: <Truck className="h-5 w-5 text-primary" />,
      questions: [
        {
          q: "How long will it take to receive my order?",
          a: "Standard shipping takes 3-5 business days depending on your location. Expedited shipping options are available at checkout. You can check our detailed Shipping Policy for more info.",
        },
        {
          q: "Do you offer international shipping?",
          a: "Currently, we only ship domestically. We are actively working on expanding our logistics to support international deliveries in the near future.",
        },
        {
          q: "Where is my order? How can I track it?",
          a: "Once your order ships, we'll email you a tracking number. You can also use our 'Track Order' page directly by entering your Order ID, or by clicking the 'Track' button next to your order in the 'My Orders' page.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      icon: <MapPin className="h-5 w-5 text-primary" />,
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer a 30-day money-back guarantee. If you are not completely satisfied, you may return unused items in their original packaging within 30 days of receipt. Please visit our Shipping & Returns page for detailed instructions.",
        },
        {
          q: "How long does a refund take to process?",
          a: "Once we receive and inspect your returned item, your refund will be processed. The credit will automatically be applied to your original method of payment within 5-7 business days.",
        },
        {
          q: "Do I have to pay for return shipping?",
          a: "Return shipping is free if the return is due to a defect or an error on our part. For remorse returns, a nominal return shipping fee may be deducted from your refund.",
        },
      ],
    },
  ];

  // Search filtering
  const filteredFaqs = faqs
    .map((category) => {
      return {
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      };
    })
    .filter((category) => category.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl min-h-[70vh]">
      <div className="text-center mb-16 animate-in slide-in-from-bottom-8 duration-500 fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
          Have questions? We're here to help. Search for your issue below, or
          browse through our most commonly asked questions.
        </p>

        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
          <Input
            type="text"
            placeholder="Search FAQs (e.g., 'returns', 'shipping')..."
            className="pl-12 h-14 text-base font-medium rounded-full border-2 border-border/80 bg-background focus-visible:ring-primary/20 shadow-sm transition-all focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredFaqs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 animate-in fade-in duration-700">
          {filteredFaqs.map((category, idx) => (
            <div
              key={idx}
              className={`${filteredFaqs.length === 1 ? "md:col-span-3 max-w-3xl mx-auto w-full" : "md:col-span-3"} mb-2`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold">{category.category}</h2>
              </div>

              <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-1">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, fIdx) => (
                      <AccordionItem
                        key={fIdx}
                        value={`item-${idx}-${fIdx}`}
                        className="border-b last:border-0 border-border/50 px-4 md:px-6"
                      >
                        <AccordionTrigger className="text-left font-semibold text-base py-5 hover:no-underline hover:text-primary transition-colors">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed text-[15px] pb-6 pt-1">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in zoom-in-95 duration-500">
          <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Matches Found</h3>
          <p className="text-muted-foreground text-lg max-w-md">
            We couldn't find any FAQs matching "{searchQuery}". Please try
            adjusting your search terms.
          </p>
        </div>
      )}

      {/* Contact Section */}
      <div className="mt-24 text-center animate-in slide-in-from-bottom-8 duration-800 delay-150 fade-in">
        <div className="max-w-3xl mx-auto bg-muted/20 border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Still need help?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            If you couldn't find the answer to your question, our support team
            is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button
              onClick={() => {
                navigator.clipboard.writeText("Gujarathirohithkumar@gmail.com");
                toast.success("Support email copied to clipboard!");
              }}
              className="flex items-center gap-3 bg-foreground text-background font-bold px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-all text-[15px]"
            >
              <Mail className="h-5 w-5" />
              Email Support
            </button>
            <Link
              to="/track-order"
              className="flex items-center gap-3 bg-primary/10 text-primary font-bold px-8 py-4 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all text-[15px]"
            >
              <Truck className="h-5 w-5" />
              Track Your Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
