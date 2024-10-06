export class TimedValue
{
    constructor(phases)
    {
        this.phases = phases;
        this.startPhase(0);
    }

    startPhase(phaseIdx)
    {
        this.phaseIdx = phaseIdx;
        this.remainingTimeMs = this.phases[phaseIdx].ms;
    }

    update(deltaTimeMs)
    {
        if (this.remainingTimeMs === undefined)
            return;

        while (this.remainingTimeMs <= deltaTimeMs) {
            deltaTimeMs -= this.remainingTimeMs;
            this.startPhase((this.phaseIdx + 1) % this.phases.length);
        }
        this.remainingTimeMs -= deltaTimeMs;
    }

    value() { return this.phases[this.phaseIdx].val; }
}