import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { ChevronDown, ChevronRight, Volume2, Clock, Wrench, Zap } from 'lucide-react';

interface AdvancedAudioEffectsProps {
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const AdvancedAudioEffects: React.FC<AdvancedAudioEffectsProps> = ({ control }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const SectionHeader: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string
  }> = ({ id, title, icon, description }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon}
        <div className="text-left">
          <h3 className="font-medium text-card-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {expandedSections.has(id) ? (
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      ) : (
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">Advanced Audio Effects</h3>

      {/* Basic Processing Section */}
      <div className="space-y-2">
        <SectionHeader
          id="basic"
          title="Basic Audio Processing"
          icon={<Volume2 className="w-5 h-5 text-blue-600" />}
          description="Volume control, EQ, dynamics, and stereo processing"
        />

        {expandedSections.has('basic') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            {/* Volume Controls */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Volume & Dynamics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Amplify (dB)</label>
                  <Controller
                    name="basicProcessing.amplify"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="-60"
                        max="60"
                        step="1"
                        value={value || 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">-60dB to +60dB</div>
                </div>

                <div>
                  <Controller
                    name="basicProcessing.normalize"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <label className="flex items-center space-x-2">
                        <input
                          {...field}
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => onChange(e.target.checked)}
                          className="rounded border-input bg-input"
                        />
                        <span className="text-sm text-card-foreground">Normalize Audio</span>
                      </label>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Fade In (seconds)</label>
                  <Controller
                    name="basicProcessing.fadeIn"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        max="30"
                        step="0.1"
                        value={value || 0}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 0 : Number(val));
                        }}
                        className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Fade Out (seconds)</label>
                  <Controller
                    name="basicProcessing.fadeOut"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        max="30"
                        step="0.1"
                        value={value || 0}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 0 : Number(val));
                        }}
                        className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* EQ */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Equalizer</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Controller
                    name="basicProcessing.equalizer.enabled"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <label className="flex items-center space-x-2">
                        <input
                          {...field}
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => onChange(e.target.checked)}
                          className="rounded border-input bg-input"
                        />
                        <span className="text-sm text-card-foreground">Enable EQ</span>
                      </label>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">EQ Preset</label>
                  <Controller
                    name="basicProcessing.equalizer.preset"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                        <option value="none">None</option>
                        <option value="bass-boost">Bass Boost</option>
                        <option value="treble-boost">Treble Boost</option>
                        <option value="vocal">Vocal Enhance</option>
                        <option value="classical">Classical</option>
                        <option value="rock">Rock</option>
                        <option value="jazz">Jazz</option>
                      </select>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Stereo Processing */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Stereo Processing</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Pan</label>
                  <Controller
                    name="basicProcessing.stereo.pan"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="-100"
                        max="100"
                        step="5"
                        value={value || 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">Left ← → Right</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Stereo Width</label>
                  <Controller
                    name="basicProcessing.stereo.width"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="0"
                        max="200"
                        step="10"
                        value={value || 100}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">0% to 200%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time-Based Effects Section */}
      <div className="space-y-2">
        <SectionHeader
          id="timebased"
          title="Time-Based Effects"
          icon={<Clock className="w-5 h-5 text-green-600" />}
          description="Reverb, delay, echo, and modulation effects"
        />

        {expandedSections.has('timebased') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            {/* Reverb */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Reverb</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Controller
                    name="timeBasedEffects.reverb.enabled"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <label className="flex items-center space-x-2">
                        <input
                          {...field}
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => onChange(e.target.checked)}
                          className="rounded border-input bg-input"
                        />
                        <span className="text-sm text-card-foreground">Enable Reverb</span>
                      </label>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Reverb Type</label>
                  <Controller
                    name="timeBasedEffects.reverb.type"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                        <option value="none">None</option>
                        <option value="room">Room</option>
                        <option value="hall">Hall</option>
                        <option value="plate">Plate</option>
                        <option value="spring">Spring</option>
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Room Size</label>
                  <Controller
                    name="timeBasedEffects.reverb.roomSize"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={value || 50}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">0% to 100%</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Wet/Dry Mix</label>
                  <Controller
                    name="timeBasedEffects.reverb.wetLevel"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={value || 30}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">Dry ← → Wet</div>
                </div>
              </div>
            </div>

            {/* Delay */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Delay & Echo</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Controller
                    name="timeBasedEffects.delay.enabled"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <label className="flex items-center space-x-2">
                        <input
                          {...field}
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => onChange(e.target.checked)}
                          className="rounded border-input bg-input"
                        />
                        <span className="text-sm text-card-foreground">Enable Delay</span>
                      </label>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Delay Type</label>
                  <Controller
                    name="timeBasedEffects.delay.type"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                        <option value="none">None</option>
                        <option value="echo">Simple Echo</option>
                        <option value="multi-tap">Multi-tap</option>
                        <option value="ping-pong">Ping-Pong</option>
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Delay Time (ms)</label>
                  <Controller
                    name="timeBasedEffects.delay.time"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        max="2000"
                        step="10"
                        value={value || 500}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 500 : Number(val));
                        }}
                        className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Feedback (%)</label>
                  <Controller
                    name="timeBasedEffects.delay.feedback"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="0"
                        max="95"
                        step="5"
                        value={value || 30}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">0% to 95%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Restoration Section */}
      <div className="space-y-2">
        <SectionHeader
          id="restoration"
          title="Restoration & Cleanup"
          icon={<Wrench className="w-5 h-5 text-orange-600" />}
          description="Noise reduction, de-hum, declip, and silence detection"
        />

        {expandedSections.has('restoration') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="restoration.noiseReduction.enabled"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">Noise Reduction</span>
                    </label>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="restoration.deHum.enabled"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">De-hum (50/60Hz)</span>
                    </label>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="restoration.declip.enabled"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">Declip Audio</span>
                    </label>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="restoration.silenceDetection.enabled"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">Silence Detection</span>
                    </label>
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Processing Section */}
      <div className="space-y-2">
        <SectionHeader
          id="advanced"
          title="Advanced Processing"
          icon={<Zap className="w-5 h-5 text-purple-600" />}
          description="Pitch shifting, time stretching, spatial audio, and spectral processing"
        />

        {expandedSections.has('advanced') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">Pitch Shift (semitones)</label>
                <Controller
                  name="advanced.pitchShift.semitones"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="number"
                      min="-24"
                      max="24"
                      step="1"
                      value={value || 0}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? 0 : Number(val));
                      }}
                      className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                    />
                  )}
                />
                <div className="text-xs text-muted-foreground">-24 to +24 semitones</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">Time Stretch Factor</label>
                <Controller
                  name="advanced.timeStretch.factor"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="number"
                      min="0.25"
                      max="4"
                      step="0.1"
                      value={value || 1}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? 1 : Number(val));
                      }}
                      className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                    />
                  )}
                />
                <div className="text-xs text-muted-foreground">0.25x to 4x speed</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">Spatial Audio</label>
                <Controller
                  name="advanced.spatialAudio.type"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                      <option value="none">None</option>
                      <option value="binaural">Binaural</option>
                      <option value="surround">Surround</option>
                      <option value="3d">3D Audio</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">Spectral Processing</label>
                <Controller
                  name="advanced.spectral.type"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                      <option value="none">None</option>
                      <option value="vocoder">Vocoder</option>
                      <option value="formant">Formant Filter</option>
                      <option value="convolution">Convolution</option>
                    </select>
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAudioEffects;