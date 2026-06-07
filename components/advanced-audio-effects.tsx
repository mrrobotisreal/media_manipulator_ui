'use client';

import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { ChevronDown, ChevronRight, Volume2, Clock, Wrench, Zap } from 'lucide-react';
import { Trans } from 'react-i18next';
import InfoTooltip from '@/components/info-tooltip';
import { useLocalization } from '@/i18n/useLocalization';

interface AdvancedAudioEffectsProps {
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const AdvancedAudioEffects: React.FC<AdvancedAudioEffectsProps> = ({ control }) => {
  const { t } = useLocalization('interface');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [amplify, setAmplify] = useState(0);
  const [pan, setPan] = useState(0);
  const [stereoWidth, setStereoWidth] = useState(100);
  const [roomSize, setRoomSize] = useState(50);
  const [wetLevel, setWetLevel] = useState(30);
  const [feedback, setFeedback] = useState(30);
  const [pitchShift, setPitchShift] = useState(0);
  const [timeStretch, setTimeStretch] = useState(1);

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
      <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
        {t('advancedAudioEffects.title')}
        <InfoTooltip
          ariaLabel={t('advancedAudioEffects.tooltipAria')}
          width="lg"
          content={
            <div className="space-y-1">
              <p>{t('advancedAudioEffects.tooltipIntro')}</p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li><Trans i18nKey="interface:advancedAudioEffects.tooltipBasic" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="interface:advancedAudioEffects.tooltipTime" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="interface:advancedAudioEffects.tooltipRestoration" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="interface:advancedAudioEffects.tooltipAdvanced" components={{ strong: <strong /> }} /></li>
              </ul>
            </div>
          }
        />
      </h3>

      {/* Basic Processing Section */}
      <div className="space-y-2">
        <SectionHeader
          id="basic"
          title={t('advancedAudioEffects.sections.basic.title')}
          icon={<Volume2 className="w-5 h-5 text-blue-600" />}
          description={t('advancedAudioEffects.sections.basic.description')}
        />

        {expandedSections.has('basic') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            {/* Volume Controls */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                {t('advancedAudioEffects.volumeDynamics.title')}
                <InfoTooltip
                  ariaLabel={t('advancedAudioEffects.volumeDynamics.title')}
                  content={t('advancedAudioEffects.volumeDynamics.tooltip')}
                />
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.labels.amplify')}</label>
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
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 0 : Number(val));
                          setAmplify(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{amplify}dB</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedAudioEffects.labels.amplifyRange')}</div>
                </div>

                <div>
                  <Controller
                    name="basicProcessing.normalize"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="flex flex-row justify-start items-center space-x-2">
                        <label className="neon-checkbox">
                          <input type="checkbox" {...field} checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                          <div className="neon-checkbox__frame">
                            <div className="neon-checkbox__box">
                              <div className="neon-checkbox__check-container">
                                <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                                  <path d="M3,12.5l7,7L21,5"></path>
                                </svg>
                              </div>
                              <div className="neon-checkbox__glow"></div>
                              <div className="neon-checkbox__borders">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                            <div className="neon-checkbox__effects">
                              <div className="neon-checkbox__particles">
                                <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span>
                              </div>
                              <div className="neon-checkbox__rings">
                                <div className="ring"></div>
                                <div className="ring"></div>
                                <div className="ring"></div>
                              </div>
                              <div className="neon-checkbox__sparks">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                          </div>
                        </label>
                        <span className="text-sm text-card-foreground">{t('advancedAudioEffects.labels.normalize')}</span>
                      </div>
                      // <label className="flex items-center space-x-2">
                      //   <input
                      //     {...field}
                      //     type="checkbox"
                      //     checked={value || false}
                      //     onChange={(e) => onChange(e.target.checked)}
                      //     className="rounded border-input bg-input"
                      //   />
                      //   <span className="text-sm text-card-foreground">{t('advancedAudioEffects.labels.normalize')}</span>
                      // </label>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.labels.fadeIn')}</label>
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
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.labels.fadeOut')}</label>
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
              <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                {t('advancedAudioEffects.equalizer.title')}
                <InfoTooltip
                  ariaLabel={t('advancedAudioEffects.equalizer.title')}
                  content={t('advancedAudioEffects.equalizer.tooltip')}
                />
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Controller
                    name="basicProcessing.equalizer.enabled"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="flex flex-row justify-start items-center space-x-2">
                        <label className="neon-checkbox">
                          <input type="checkbox" {...field} checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                          <div className="neon-checkbox__frame">
                            <div className="neon-checkbox__box">
                              <div className="neon-checkbox__check-container">
                                <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                                  <path d="M3,12.5l7,7L21,5"></path>
                                </svg>
                              </div>
                              <div className="neon-checkbox__glow"></div>
                              <div className="neon-checkbox__borders">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                            <div className="neon-checkbox__effects">
                              <div className="neon-checkbox__particles">
                                <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span>
                              </div>
                              <div className="neon-checkbox__rings">
                                <div className="ring"></div>
                                <div className="ring"></div>
                                <div className="ring"></div>
                              </div>
                              <div className="neon-checkbox__sparks">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                          </div>
                        </label>
                        <span className="text-sm text-card-foreground">{t('advancedAudioEffects.equalizer.enable')}</span>
                      </div>
                      // <label className="flex items-center space-x-2">
                      //   <input
                      //     {...field}
                      //     type="checkbox"
                      //     checked={value || false}
                      //     onChange={(e) => onChange(e.target.checked)}
                      //     className="rounded border-input bg-input"
                      //   />
                      //   <span className="text-sm text-card-foreground">{t('advancedAudioEffects.equalizer.enable')}</span>
                      // </label>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.equalizer.presetLabel')}</label>
                  <Controller
                    name="basicProcessing.equalizer.preset"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                        <option value="none">{t('advancedAudioEffects.equalizer.presets.none')}</option>
                        <option value="bass-boost">{t('advancedAudioEffects.equalizer.presets.bass-boost')}</option>
                        <option value="treble-boost">{t('advancedAudioEffects.equalizer.presets.treble-boost')}</option>
                        <option value="vocal">{t('advancedAudioEffects.equalizer.presets.vocal')}</option>
                        <option value="classical">{t('advancedAudioEffects.equalizer.presets.classical')}</option>
                        <option value="rock">{t('advancedAudioEffects.equalizer.presets.rock')}</option>
                        <option value="jazz">{t('advancedAudioEffects.equalizer.presets.jazz')}</option>
                      </select>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Stereo Processing */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                {t('advancedAudioEffects.stereo.title')}
                <InfoTooltip
                  ariaLabel={t('advancedAudioEffects.stereo.title')}
                  content={t('advancedAudioEffects.stereo.tooltip')}
                />
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.stereo.pan')}</label>
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
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 0 : Number(val));
                          setPan(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{`${Math.abs(pan)}% ${pan > 0 ? 'Right' : 'Left'}`}</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedAudioEffects.stereo.leftRight')}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.stereo.stereoWidth')}</label>
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
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 100 : Number(val));
                          setStereoWidth(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{stereoWidth}%</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedAudioEffects.stereo.widthRange')}</div>
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
          title={t('advancedAudioEffects.sections.time.title')}
          icon={<Clock className="w-5 h-5 text-green-600" />}
          description={t('advancedAudioEffects.sections.time.description')}
        />

        {expandedSections.has('timebased') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            {/* Reverb */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                {t('advancedAudioEffects.reverb.title')}
                <InfoTooltip
                  ariaLabel={t('advancedAudioEffects.reverb.title')}
                  content={t('advancedAudioEffects.reverb.tooltip')}
                />
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Controller
                    name="timeBasedEffects.reverb.enabled"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="flex flex-row justify-start items-center space-x-2">
                        <label className="neon-checkbox">
                          <input type="checkbox" {...field} checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                          <div className="neon-checkbox__frame">
                            <div className="neon-checkbox__box">
                              <div className="neon-checkbox__check-container">
                                <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                                  <path d="M3,12.5l7,7L21,5"></path>
                                </svg>
                              </div>
                              <div className="neon-checkbox__glow"></div>
                              <div className="neon-checkbox__borders">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                            <div className="neon-checkbox__effects">
                              <div className="neon-checkbox__particles">
                                <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span>
                              </div>
                              <div className="neon-checkbox__rings">
                                <div className="ring"></div>
                                <div className="ring"></div>
                                <div className="ring"></div>
                              </div>
                              <div className="neon-checkbox__sparks">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                          </div>
                        </label>
                        <span className="text-sm text-card-foreground">{t('advancedAudioEffects.reverb.enable')}</span>
                      </div>
                      // <label className="flex items-center space-x-2">
                      //   <input
                      //     {...field}
                      //     type="checkbox"
                      //     checked={value || false}
                      //     onChange={(e) => onChange(e.target.checked)}
                      //     className="rounded border-input bg-input"
                      //   />
                      //   <span className="text-sm text-card-foreground">{t('advancedAudioEffects.reverb.enable')}</span>
                      // </label>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.reverb.typeLabel')}</label>
                  <Controller
                    name="timeBasedEffects.reverb.type"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                        <option value="none">{t('advancedAudioEffects.reverb.types.none')}</option>
                        <option value="room">{t('advancedAudioEffects.reverb.types.room')}</option>
                        <option value="hall">{t('advancedAudioEffects.reverb.types.hall')}</option>
                        <option value="plate">{t('advancedAudioEffects.reverb.types.plate')}</option>
                        <option value="spring">{t('advancedAudioEffects.reverb.types.spring')}</option>
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.reverb.roomSize')}</label>
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
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 50 : Number(val));
                          setRoomSize(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{roomSize}%</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedAudioEffects.reverb.roomRange')}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.reverb.wetDry')}</label>
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
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 30 : Number(val));
                          setWetLevel(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{`${wetLevel}%`}</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedAudioEffects.reverb.dryWet')}</div>
                </div>
              </div>
            </div>

            {/* Delay */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                {t('advancedAudioEffects.delay.title')}
                <InfoTooltip
                  ariaLabel={t('advancedAudioEffects.delay.title')}
                  content={t('advancedAudioEffects.delay.tooltip')}
                />
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Controller
                    name="timeBasedEffects.delay.enabled"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="flex flex-row justify-start items-center space-x-2">
                        <label className="neon-checkbox">
                          <input type="checkbox" {...field} checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                          <div className="neon-checkbox__frame">
                            <div className="neon-checkbox__box">
                              <div className="neon-checkbox__check-container">
                                <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                                  <path d="M3,12.5l7,7L21,5"></path>
                                </svg>
                              </div>
                              <div className="neon-checkbox__glow"></div>
                              <div className="neon-checkbox__borders">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                            <div className="neon-checkbox__effects">
                              <div className="neon-checkbox__particles">
                                <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span>
                              </div>
                              <div className="neon-checkbox__rings">
                                <div className="ring"></div>
                                <div className="ring"></div>
                                <div className="ring"></div>
                              </div>
                              <div className="neon-checkbox__sparks">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                          </div>
                        </label>
                        <span className="text-sm text-card-foreground">{t('advancedAudioEffects.delay.enable')}</span>
                      </div>
                      // <label className="flex items-center space-x-2">
                      //   <input
                      //     {...field}
                      //     type="checkbox"
                      //     checked={value || false}
                      //     onChange={(e) => onChange(e.target.checked)}
                      //     className="rounded border-input bg-input"
                      //   />
                      //   <span className="text-sm text-card-foreground">{t('advancedAudioEffects.delay.enable')}</span>
                      // </label>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.delay.typeLabel')}</label>
                  <Controller
                    name="timeBasedEffects.delay.type"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                        <option value="none">{t('advancedAudioEffects.delay.types.none')}</option>
                        <option value="echo">{t('advancedAudioEffects.delay.types.echo')}</option>
                        <option value="multi-tap">{t('advancedAudioEffects.delay.types.multi-tap')}</option>
                        <option value="ping-pong">{t('advancedAudioEffects.delay.types.ping-pong')}</option>
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.delay.delayTime')}</label>
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
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.delay.feedback')}</label>
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
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 30 : Number(val));
                          setFeedback(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{`${feedback}%`}</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedAudioEffects.delay.feedbackRange')}</div>
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
          title={t('advancedAudioEffects.sections.restoration.title')}
          icon={<Wrench className="w-5 h-5 text-orange-600" />}
          description={t('advancedAudioEffects.sections.restoration.description')}
        />

        {expandedSections.has('restoration') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="restoration.noiseReduction.enabled"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <div className="flex flex-row justify-start items-center space-x-2">
                        <label className="neon-checkbox">
                          <input type="checkbox" {...field} checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                          <div className="neon-checkbox__frame">
                            <div className="neon-checkbox__box">
                              <div className="neon-checkbox__check-container">
                                <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                                  <path d="M3,12.5l7,7L21,5"></path>
                                </svg>
                              </div>
                              <div className="neon-checkbox__glow"></div>
                              <div className="neon-checkbox__borders">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                            <div className="neon-checkbox__effects">
                              <div className="neon-checkbox__particles">
                                <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span>
                              </div>
                              <div className="neon-checkbox__rings">
                                <div className="ring"></div>
                                <div className="ring"></div>
                                <div className="ring"></div>
                              </div>
                              <div className="neon-checkbox__sparks">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                          </div>
                        </label>
                        <span className="text-sm text-card-foreground">{t('advancedAudioEffects.restoration.noiseReduction')}</span>
                      </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">{t('advancedAudioEffects.restoration.noiseReduction')}</span>
                    // </label>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="restoration.deHum.enabled"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <div className="flex flex-row justify-start items-center space-x-2">
                        <label className="neon-checkbox">
                          <input type="checkbox" {...field} checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                          <div className="neon-checkbox__frame">
                            <div className="neon-checkbox__box">
                              <div className="neon-checkbox__check-container">
                                <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                                  <path d="M3,12.5l7,7L21,5"></path>
                                </svg>
                              </div>
                              <div className="neon-checkbox__glow"></div>
                              <div className="neon-checkbox__borders">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                            <div className="neon-checkbox__effects">
                              <div className="neon-checkbox__particles">
                                <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span>
                              </div>
                              <div className="neon-checkbox__rings">
                                <div className="ring"></div>
                                <div className="ring"></div>
                                <div className="ring"></div>
                              </div>
                              <div className="neon-checkbox__sparks">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                          </div>
                        </label>
                        <span className="text-sm text-card-foreground">{t('advancedAudioEffects.restoration.deHum')}</span>
                      </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">{t('advancedAudioEffects.restoration.deHum')}</span>
                    // </label>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="restoration.declip.enabled"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <div className="flex flex-row justify-start items-center space-x-2">
                        <label className="neon-checkbox">
                          <input type="checkbox" {...field} checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                          <div className="neon-checkbox__frame">
                            <div className="neon-checkbox__box">
                              <div className="neon-checkbox__check-container">
                                <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                                  <path d="M3,12.5l7,7L21,5"></path>
                                </svg>
                              </div>
                              <div className="neon-checkbox__glow"></div>
                              <div className="neon-checkbox__borders">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                            <div className="neon-checkbox__effects">
                              <div className="neon-checkbox__particles">
                                <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span>
                              </div>
                              <div className="neon-checkbox__rings">
                                <div className="ring"></div>
                                <div className="ring"></div>
                                <div className="ring"></div>
                              </div>
                              <div className="neon-checkbox__sparks">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                          </div>
                        </label>
                        <span className="text-sm text-card-foreground">{t('advancedAudioEffects.restoration.declip')}</span>
                      </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">{t('advancedAudioEffects.restoration.declip')}</span>
                    // </label>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="restoration.silenceDetection.enabled"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <div className="flex flex-row justify-start items-center space-x-2">
                        <label className="neon-checkbox">
                          <input type="checkbox" {...field} checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                          <div className="neon-checkbox__frame">
                            <div className="neon-checkbox__box">
                              <div className="neon-checkbox__check-container">
                                <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                                  <path d="M3,12.5l7,7L21,5"></path>
                                </svg>
                              </div>
                              <div className="neon-checkbox__glow"></div>
                              <div className="neon-checkbox__borders">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                            <div className="neon-checkbox__effects">
                              <div className="neon-checkbox__particles">
                                <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span>
                              </div>
                              <div className="neon-checkbox__rings">
                                <div className="ring"></div>
                                <div className="ring"></div>
                                <div className="ring"></div>
                              </div>
                              <div className="neon-checkbox__sparks">
                                <span></span><span></span><span></span><span></span>
                              </div>
                            </div>
                          </div>
                        </label>
                        <span className="text-sm text-card-foreground">{t('advancedAudioEffects.restoration.silenceDetection')}</span>
                      </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">{t('advancedAudioEffects.restoration.silenceDetection')}</span>
                    // </label>
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
          title={t('advancedAudioEffects.sections.advanced.title')}
          icon={<Zap className="w-5 h-5 text-purple-600" />}
          description={t('advancedAudioEffects.sections.advanced.description')}
        />

        {expandedSections.has('advanced') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.advanced.pitchShift')}</label>
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
                        setPitchShift(Number(val));
                      }}
                      className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                    />
                  )}
                />
                <span className='text-xs text-foreground text-center'>{t('advancedAudioEffects.advanced.pitchValue', { value: pitchShift })}</span>
                <div className="text-xs text-muted-foreground">{t('advancedAudioEffects.advanced.pitchRange')}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.advanced.timeStretch')}</label>
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
                        setTimeStretch(Number(val));
                      }}
                      className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                    />
                  )}
                />
                <span className='text-xs text-foreground text-center'>{t('advancedAudioEffects.advanced.timeStretchValue', { value: timeStretch })}</span>
                <div className="text-xs text-muted-foreground">{t('advancedAudioEffects.advanced.timeStretchRange')}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.advanced.spatialAudio')}</label>
                <Controller
                  name="advanced.spatialAudio.type"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                      <option value="none">{t('advancedAudioEffects.advanced.spatial.none')}</option>
                      <option value="binaural">{t('advancedAudioEffects.advanced.spatial.binaural')}</option>
                      <option value="surround">{t('advancedAudioEffects.advanced.spatial.surround')}</option>
                      <option value="3d">{t('advancedAudioEffects.advanced.spatial.3d')}</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedAudioEffects.advanced.spectral')}</label>
                <Controller
                  name="advanced.spectral.type"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                      <option value="none">{t('advancedAudioEffects.advanced.spectralOptions.none')}</option>
                      <option value="vocoder">{t('advancedAudioEffects.advanced.spectralOptions.vocoder')}</option>
                      <option value="formant">{t('advancedAudioEffects.advanced.spectralOptions.formant')}</option>
                      <option value="convolution">{t('advancedAudioEffects.advanced.spectralOptions.convolution')}</option>
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