using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class Consumption
    {
        public decimal peak;
        public decimal valley;
        public decimal flat;
        public decimal peakPeak;

        public decimal peakRate;
        public decimal valleyRate;
        public decimal flatRate;
        public decimal peakPeakRate;

        public Consumption(decimal peak, decimal valley, decimal flat, decimal peakPeak, decimal peakRate, decimal valleyRate, decimal flatRate, decimal peakPeakRate)
        {
            // TODO: Complete member initialization
            this.peak = peak;
            this.valley = valley;
            this.flat = flat;
            this.peakPeak = peakPeak;

            this.peakRate = peakRate;
            this.valleyRate = valleyRate;
            this.flatRate = flatRate;
            this.peakPeakRate = peakPeakRate;
        }
    }
}
