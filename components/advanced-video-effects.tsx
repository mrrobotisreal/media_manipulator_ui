'use client';

import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { ChevronDown, ChevronRight, Palette, Move, Clock, Settings } from 'lucide-react';
import { Trans } from 'react-i18next';
import InfoTooltip from '@/components/info-tooltip';
import { useLocalization } from '@/i18n/useLocalization';

interface AdvancedVideoEffectsProps {
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const AdvancedVideoEffects: React.FC<AdvancedVideoEffectsProps> = ({ control }) => {
  const { t } = useLocalization('interface');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [hue, setHue] = useState(0);
  const [gaussianBlur, setGaussianBlur] = useState(0);

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
        {t('advancedVideoEffects.title')}
        <InfoTooltip
          ariaLabel={t('advancedVideoEffects.tooltipAria')}
          width="lg"
          content={
            <div className="space-y-1">
              <p>{t('advancedVideoEffects.tooltipIntro')}</p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li><Trans i18nKey="interface:advancedVideoEffects.tooltipVisual" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="interface:advancedVideoEffects.tooltipTransform" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="interface:advancedVideoEffects.tooltipTemporal" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="interface:advancedVideoEffects.tooltipAdvanced" components={{ strong: <strong /> }} /></li>
              </ul>
            </div>
          }
        />
      </h3>

      {/* Visual Effects Section */}
      <div className="space-y-2">
        <SectionHeader
          id="visual"
          title={t('advancedVideoEffects.sections.visual.title')}
          icon={<Palette className="w-5 h-5 text-blue-600" />}
          description={t('advancedVideoEffects.sections.visual.description')}
        />

        {expandedSections.has('visual') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            {/* Color/Exposure */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                {t('advancedVideoEffects.colorExposure.title')}
                <InfoTooltip
                  ariaLabel={t('advancedVideoEffects.colorExposure.title')}
                  content={t('advancedVideoEffects.colorExposure.tooltip')}
                />
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedVideoEffects.labels.brightness')}</label>
                  <Controller
                    name="visualEffects.brightness"
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
                          setBrightness(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{brightness}</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedVideoEffects.ranges.hundred')}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedVideoEffects.labels.contrast')}</label>
                  <Controller
                    name="visualEffects.contrast"
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
                          setContrast(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{contrast}</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedVideoEffects.ranges.hundred')}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedVideoEffects.labels.saturation')}</label>
                  <Controller
                    name="visualEffects.saturation"
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
                          setSaturation(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{saturation}</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedVideoEffects.ranges.hundred')}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedVideoEffects.labels.hue')}</label>
                  <Controller
                    name="visualEffects.hue"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={value || 0}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 0 : Number(val));
                          setHue(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{hue}°</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedVideoEffects.ranges.hue')}</div>
                </div>
              </div>
            </div>

            {/* Blur/Sharpen */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                {t('advancedVideoEffects.blurSharpen.title')}
                <InfoTooltip
                  ariaLabel={t('advancedVideoEffects.blurSharpen.title')}
                  content={t('advancedVideoEffects.blurSharpen.tooltip')}
                />
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedVideoEffects.labels.gaussianBlur')}</label>
                  <Controller
                    name="visualEffects.gaussianBlur"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={value || 0}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 0 : Number(val));
                          setGaussianBlur(Number(val));
                        }}
                        className="w-full"
                      />
                    )}
                  />
                  <span className='text-xs text-foreground text-center'>{gaussianBlur}px</span>
                  <div className="text-xs text-muted-foreground text-center">{t('advancedVideoEffects.ranges.blur')}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedVideoEffects.labels.artisticEffect')}</label>
                  <Controller
                    name="visualEffects.artistic"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                        <option value="none">{t('advancedVideoEffects.artistic.none')}</option>
                        <option value="oil-painting">{t('advancedVideoEffects.artistic.oil-painting')}</option>
                        <option value="watercolor">{t('advancedVideoEffects.artistic.watercolor')}</option>
                        <option value="sketch">{t('advancedVideoEffects.artistic.sketch')}</option>
                        <option value="emboss">{t('advancedVideoEffects.artistic.emboss')}</option>
                        <option value="edge-detection">{t('advancedVideoEffects.artistic.edge-detection')}</option>
                        <option value="posterize">{t('advancedVideoEffects.artistic.posterize')}</option>
                      </select>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transform Section */}
      <div className="space-y-2">
        <SectionHeader
          id="transform"
          title={t('advancedVideoEffects.sections.transform.title')}
          icon={<Move className="w-5 h-5 text-green-600" />}
          description={t('advancedVideoEffects.sections.transform.description')}
        />

        {expandedSections.has('transform') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedVideoEffects.labels.rotation')}</label>
                <Controller
                  name="transform.rotation"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="number"
                      min="-360"
                      max="360"
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
              </div>

              <div className="space-y-2">
                <Controller
                  name="transform.flipHorizontal"
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
                      <span className="text-sm text-card-foreground">{t('advancedVideoEffects.labels.flipHorizontal')}</span>
                    </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">Flip Horizontal</span>
                    // </label>
                  )}
                />

                <Controller
                  name="transform.flipVertical"
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
                      <span className="text-sm text-card-foreground">{t('advancedVideoEffects.labels.flipVertical')}</span>
                    </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">Flip Vertical</span>
                    // </label>
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Temporal Effects Section */}
      <div className="space-y-2">
        <SectionHeader
          id="temporal"
          title={t('advancedVideoEffects.sections.temporal.title')}
          icon={<Clock className="w-5 h-5 text-purple-600" />}
          description={t('advancedVideoEffects.sections.temporal.description')}
        />

        {expandedSections.has('temporal') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="temporal.reverse"
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
                      <span className="text-sm text-card-foreground">{t('advancedVideoEffects.labels.reverseVideo')}</span>
                    </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">Reverse Video</span>
                    // </label>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="temporal.pingPong"
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
                      <span className="text-sm text-card-foreground">{t('advancedVideoEffects.labels.pingPong')}</span>
                    </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">Ping-Pong Loop</span>
                    // </label>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedVideoEffects.labels.targetFrameRate')}</label>
                <Controller
                  name="temporal.frameRate.target"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="number"
                      min="1"
                      max="120"
                      step="1"
                      placeholder={t('advancedVideoEffects.autoPlaceholder')}
                      value={value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? undefined : Number(val));
                      }}
                      className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="temporal.stabilization.enabled"
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
                      <span className="text-sm text-card-foreground">{t('advancedVideoEffects.labels.stabilization')}</span>
                    </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">Video Stabilization</span>
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
          title={t('advancedVideoEffects.sections.advanced.title')}
          icon={<Settings className="w-5 h-5 text-red-600" />}
          description={t('advancedVideoEffects.sections.advanced.description')}
        />

        {expandedSections.has('advanced') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="advanced.deinterlace"
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
                      <span className="text-sm text-card-foreground">{t('advancedVideoEffects.labels.deinterlace')}</span>
                    </div>
                    // <label className="flex items-center space-x-2">
                    //   <input
                    //     {...field}
                    //     type="checkbox"
                    //     checked={value || false}
                    //     onChange={(e) => onChange(e.target.checked)}
                    //     className="rounded border-input bg-input"
                    //   />
                    //   <span className="text-sm text-card-foreground">Deinterlace Video</span>
                    // </label>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">{t('advancedVideoEffects.labels.outputColorSpace')}</label>
                <Controller
                  name="advanced.colorSpace.output"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                      <option value="rec709">{t('advancedVideoEffects.colorSpace.rec709')}</option>
                      <option value="rec2020">{t('advancedVideoEffects.colorSpace.rec2020')}</option>
                      <option value="srgb">{t('advancedVideoEffects.colorSpace.srgb')}</option>
                      <option value="p3">{t('advancedVideoEffects.colorSpace.p3')}</option>
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

export default AdvancedVideoEffects;