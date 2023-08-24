import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Language, Owner, analyze } from "@/lib/analyze";
import { useStarStore, useAccountStore } from "@/store";
import { Button } from "@/components/ui/button";
import { ActivityIcon } from "lucide-react";
export default function Analyze() {
  const accountStore = useAccountStore();
  const starStore = useStarStore();

  const [dialogOpen, setDialogOpen] = useState(false);

  const ownerChartRef = useRef<HTMLDivElement | null>(null);
  let ownerChart: echarts.ECharts | null = null;

  const languageChartRef = useRef<HTMLDivElement | null>(null);
  let languageChart: echarts.ECharts | null = null;

  async function renderOwners(owners: Owner[]) {
    try {
      const richs: Record<
        string,
        {
          height: number;
          width: number;
          align: string;
          backgroundColor: {
            image: string;
          };
        }
      > | null = {};

      owners.forEach((item) => {
        richs[item.name] = {
          height: 20,
          width: 20,
          align: "right",
          backgroundColor: {
            image: item.avatar,
          },
        };
      });

      ownerChart = echarts.init(ownerChartRef.current);
      ownerChart.setOption({
        grid: {
          left: 0,
          top: 0,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: "value",
        },
        yAxis: {
          inverse: true,
          offset: 0,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          type: "category",
          data: owners.map((i) => i.name),
          axisLabel: {
            formatter: function (value: any) {
              return `{${value}|}\n{value|${
                value.length > 10 ? value.slice(0, 7) + "..." : value
              }}`;
            },
            rich: {
              value: {
                lineHeight: 16,
                align: "right",
              },
              ...richs,
            },
          },
        },
        series: [
          {
            data: owners.map((i) => i.count),
            type: "bar",
            label: {
              show: true,
              position: "right",
            },
            itemStyle: {
              color: "rgb(0, 98, 236)",
              borderRadius: 5,
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function renderLanguages(languages: Language[]) {
    try {
      languageChart = echarts.init(languageChartRef.current);
      languageChart.setOption({
        grid: {
          top: 0,
          left: 0,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: "value",
        },
        yAxis: {
          inverse: true,
          offset: 0,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: function (value: any) {
              return `${value.length > 10 ? value.slice(0, 7) + "..." : value}`;
            },
          },

          type: "category",
          data: languages.map((i) => i.name),
        },
        series: [
          {
            data: languages.map((i) => {
              return {
                value: i.count,
                itemStyle: {
                  color: i.color,
                  borderRadius: 5,
                },
              };
            }),
            type: "bar",
            label: {
              show: true,
              position: "right",
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (dialogOpen) {
      analyze(
        accountStore.currentAccount?.login!,
        starStore.searchQueryForm
      ).then(({ owners, languages }) => {
        renderOwners(owners);
        renderLanguages(languages);
      });
    }

    return () => {
      ownerChart?.dispose();
      languageChart?.dispose();
    };
  }, [dialogOpen]);

  return (
    <Dialog onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger>
        <Button variant="outline">
          <ActivityIcon className="w-4 h-4 mr-2"></ActivityIcon>
          Analyze
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[40rem] h-[45rem] px-4">
        <DialogHeader>
          <DialogTitle>Analyze</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="text-lg leading-none text-muted-foreground font-bold">
            Top 5 Most Star Owners
          </div>
          <div ref={ownerChartRef} className="w-[38rem] h-[16rem]"></div>
          <div className="text-lg leading-none text-muted-foreground font-bold">
            Top 5 Most Star Languages
          </div>
          <div ref={languageChartRef} className="w-[38rem] h-[16rem]"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
