{
    filteredCandidates.slice((currentPage - 1) * 10, currentPage * 10)
            .length > 0 ? (
            filteredCandidates
              .slice((currentPage - 1) * 10, currentPage * 10)
              .map((c) => (
                <div
                  key={c.id}
                  className={`bg-white border rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden ${
                    c.selected
                      ? "border-blue-500 bg-blue-50/5 shadow-blue-100/20"
                      : "border-slate-200"
                  }`}
                >
                  {/* Security Watermark Anchor */}
                  <ShieldCheck
                    className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
                    size={150}
                  />

                  <div className="relative z-10 space-y-6">
                    {/* TOP SECTION: IDENTITY & ENGAGEMENT */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={c.selected}
                          onChange={() => toggleSelect(c.id)}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer shadow-sm transition-transform hover:scale-110"
                        />
                        <div className="relative">
                          <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase tracking-tighter ring-4 ring-white">
                            {(c.full_name || "U").charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
                            {c.full_name?.toLowerCase()}
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {/* {calculateAge(c.dob)} •{" "} */}
                            {c.age} • {c.gender || "Not Specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MIDDLE SECTION: CORE METADATA STRIP */}
                    <div className="space-y-4 pl-14">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2">
                        {/* EXPERIENCE NODE */}
                        <div className="flex items-center gap-3 group">
                          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-white text-blue-600 shadow-sm transition-all  group-hover:text-blue-600">
                            <Briefcase size={18} strokeWidth={2.5} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
                              Total Experience
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
                                {c.total_experience_years || "Not Specified"}
                              </span>
                              {/* Optional secondary badge for months */}
                            </div>
                          </div>
                        </div>

                        <div className="h-6 w-[13px] bg-slate-100 hidden sm:block" />

                        {/* LOCATION NODE */}
                        <div className="flex items-center gap-3 group">
                          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-white text-blue-600 shadow-sm transition-colors group-hover:border-blue-200 group-hover:text-blue-600">
                            <MapPin size={18} strokeWidth={2.5} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
                              Location
                            </span>
                            <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
                              {c.city || "Not Specified"}
                            </span>
                          </div>
                        </div>

                        <div className="h-6 w-[1px] bg-slate-100 hidden sm:block" />

                        <div className="flex items-center gap-3 group min-w-[140px]">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-xl bg-white border shadow-sm transition-colors ${
                              c.latestCTC
                                ? "border-emerald-100 text-blue-600"
                                : "border-slate-100 text-blue-500"
                            }`}
                          >
                            <span className="text-[16px] font-black leading-none">
                              ₹
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1.5">
                              Previous CTC
                            </span>

                            <div className="flex items-center gap-1.5">
                              {c.latestCTC ? (
                                /* DATA PRESENT: Emerald Success State */
                                <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
                                  {(c.latestCTC / 100000).toFixed(2)}{" "}
                                  <span className="text-blue-600 text-[11px]">
                                    LPA
                                  </span>
                                </span>
                              ) : (
                                /* DATA MISSING: Neutral Slate State */
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">
                                  Not Specified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 min-w-[160px]">
                        <div className="flex-shrink-0 p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                          <Zap size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                            Languages
                          </p>
                          <div className="text-[13px] font-black text-slate-900 uppercase leading-tight">
                            {c.languages_spoken &&
                            c.languages_spoken.length > 0 ? (
                              <div className="flex items-center flex-wrap gap-1">
                                {/* Main Logic: If total > 2, we use the collapse pattern */}
                                <span>
                                  {c.isLanguagesExpanded
                                    ? c.languages_spoken.join(", ")
                                    : c.languages_spoken.slice(0, 2).join(", ")}
                                </span>

                                {c.languages_spoken.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // We update the candidate object locally or via a toggle function
                                      handleToggleLanguages(c.id);
                                    }}
                                    className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-black border transition-all cursor-pointer ${
                                      c.isLanguagesExpanded
                                        ? "bg-slate-900 text-white border-slate-900"
                                        : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white"
                                    }`}
                                  >
                                    {c.isLanguagesExpanded
                                      ? "SHOW LESS"
                                      : `+${c.languages_spoken.length - 2} MORE`}
                                  </button>
                                )}
                              </div>
                            ) : (
                              "Not Specified"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RELEVANT EXPERIENCE BOX (High Contrast Container) */}

                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 ml-14 relative overflow-hidden transition-all duration-300">
                      {/* VERTICAL ACCENT LINE */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

                      <div className="space-y-3">
                        {/* HEADER SECTION */}

                        {/* DATA GRID: 3 COLS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* ROLE */}
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                              <UserCog size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5">
                                Current Job
                              </p>
                              <p className="text-[13px] font-black text-slate-900 uppercase truncate max-w-[120px]">
                                {c.latestJobTitle || "Not Specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 min-w-[160px]">
                            <div className="flex-shrink-0 p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                              <Layers size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                                Industry
                              </p>
                              <div className="text-[13px] font-black text-slate-900 uppercase leading-tight flex items-center flex-wrap gap-1">
                                {c.industries_worked &&
                                c.industries_worked.length > 0 ? (
                                  <>
                                    <span>
                                      {c.industries_worked
                                        .slice(0, 2)
                                        .map((ind) => ind.name)
                                        .join(", ")}
                                    </span>
                                    {c.industries_worked.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toast(
                                            <div className="p-1">
                                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b pb-1">
                                                Full Industry History
                                              </p>
                                              <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                                                {c.industries_worked
                                                  .map((i) => i.name)
                                                  .join(", ")}
                                              </p>
                                            </div>,
                                            {
                                              style: {
                                                borderRadius: "1rem",
                                                border: "1px solid #f1f5f9",
                                                padding: "12px",
                                              },
                                              duration: 3000,
                                            },
                                          );
                                        }}
                                        className="ml-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                                      >
                                        +{c.industries_worked.length - 2} MORE
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  "Not Specified"
                                )}
                              </div>
                            </div>
                          </div>

                          {/* EDUCATION NODE */}
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                              <GraduationCap size={18} strokeWidth={2.5} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5">
                                Education
                              </p>
                              <p
                                className="text-[13px] font-black text-slate-800 uppercase truncate"
                                title={c.highestDegree}
                              >
                                {c.highestDegree}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* SKILLS STACK */}
                        <div className="pt-2 border-t border-slate-200/50">
                          <div className="flex flex-wrap items-center gap-1.5 transition-all">
                            <div className="p-1 mr-1 text-blue-600 bg-white rounded-lg shadow-sm border border-slate-100">
                              <Zap size={18} strokeWidth={3} />
                            </div>

                            <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5">
                                Skill
                              </p>
                              {/* IF NO SKILLS */}
                              {(!c.skills || c.skills.length === 0) && (
                                <span className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">
                                  Not Specified
                                </span>
                              )}

                              {/* SKILL MAPPING */}
                              {(showAllSkills
                                ? c.skills
                                : (c.skills || []).slice(0, 6)
                              ).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded text-[9px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-colors cursor-default"
                                >
                                  {skill}
                                </span>
                              ))}

                              {/* TOGGLE BUTTON */}
                              {(c.skills || []).length > 6 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAllSkills(!showAllSkills);
                                  }}
                                  className="px-2 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-900 transition-all active:scale-90"
                                >
                                  {showAllSkills
                                    ? "Show Less"
                                    : `+${(c.skills || []).length - 6} More`}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM SECTION: SYNC DATA & OPERATIONS (Right Aligned) */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 ml-14">
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-slate-600" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                          {formatRelativeTime(c.added)}
                        </p>
                      </div>

                      {/* ACTION STACK: ANCHORED BOTTOM RIGHT */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* NEW: DECISION DROPDOWN */}
                        <div className="relative group/decision">
                          <select
                            onChange={(e) => {
                              if (e.target.value)
                                handleStatusUpdate(c.id, e.target.value);
                              e.target.value = ""; // Reset dropdown after selection
                            }}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all cursor-pointer outline-none shadow-sm"
                          >
                            <option value="">Decision</option>
                            <option value="hold" className="text-slate-600">
                              Put on Hold
                            </option>
                            <option value="reject" className="text-slate-600">
                              Reject Candidate
                            </option>
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/decision:text-blue-600"
                          />
                        </div>
                        <button
                          onClick={() => navigate(`/profile/${c.id}`)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() => navigate(`/editentry/${c.id}`)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue transition-all shadow-xl shadow-slate-200 active:scale-95"
                        >
                          <Pencil size={14} /> Edit Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            /* EMPTY DATA UI */
            <div className="py-32 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-[3rem] shadow-inner">
              <Database size={48} className="text-slate-100 mb-4" />
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                No Candidates Found
              </p>
            </div>
          )}