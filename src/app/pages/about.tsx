import { teams } from "../data/mock-data";
import { CheckCircle } from "lucide-react";

export function About() {
  return (
    <div className="w-full py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* About KHUX */}
        <section className="max-w-4xl mx-auto mb-20">
          <h1 className="text-4xl sm:text-5xl mb-6 text-center">About KHUX</h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            경희대학교 UX/UI 리서치 학회
          </p>

          <div className="prose prose-lg max-w-none">
            <p className="mb-6 text-foreground/90 leading-relaxed">
              KHUX는 사용자 경험(UX)과 사용자 인터페이스(UI) 디자인에 관심 있는
              학생들이 모여 함께 연구하고 성장하는 학회입니다. 우리는 이론적
              학습뿐만 아니라 실제 프로젝트를 통해 실무 능력을 키우고, 업계
              전문가들과의 네트워킹을 통해 미래를 준비합니다.
            </p>

            <p className="mb-6 text-foreground/90 leading-relaxed">
              매 학기 정기적인 세미나, 워크숍, 스터디를 진행하며, 멤버들이 자유롭게
              아이디어를 공유하고 협업할 수 있는 환경을 제공합니다. 또한 다양한
              기업 및 단체와의 협업 프로젝트를 통해 실무 경험을 쌓을 수 있는
              기회를 만들어갑니다.
            </p>

            <p className="mb-6 text-foreground/90 leading-relaxed">
              KHUX는 4개의 전문 팀(Operation, Education, Brand, PR)으로 구성되어
              있으며, 각 팀은 학회 운영의 다양한 측면을 담당하며 시너지를
              창출합니다. 모든 멤버는 자신의 관심사와 강점에 맞는 팀에서 활동하며,
              팀 간 협업을 통해 더 큰 성과를 만들어냅니다.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                사용자 중심의 디자인 사고를 통해 더 나은 디지털 경험을 만들고,
                UX/UI 분야의 미래 인재를 양성합니다.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-br from-accent to-accent/50 rounded-lg border border-border">
              <h2 className="text-2xl mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                국내 최고의 대학 UX/UI 커뮤니티로 성장하여, 업계와 학계를 연결하는
                플랫폼이 되고자 합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Teams */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl mb-4">Our Teams</h2>
            <p className="text-lg text-muted-foreground">
              KHUX를 이끌어가는 4개의 전문 팀을 소개합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teams.map((team, index) => (
              <div
                key={team.name}
                className="group p-8 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl">{team.name}</h3>
                </div>
                <p className="text-muted-foreground mb-6">{team.description}</p>
                <div className="space-y-3">
                  <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                    주요 업무
                  </div>
                  {team.responsibilities.map((responsibility) => (
                    <div
                      key={responsibility}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">
                        {responsibility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join CTA */}
        <section className="max-w-4xl mx-auto mt-20 text-center p-12 bg-gradient-to-br from-primary/5 to-accent/30 rounded-lg border border-border">
          <h2 className="text-3xl mb-4">Join KHUX</h2>
          <p className="text-lg text-muted-foreground mb-6">
            KHUX는 UX/UI에 열정이 있는 모든 학생들에게 열려있습니다.
            <br />
            함께 성장할 새로운 멤버를 기다립니다.
          </p>
          <p className="text-sm text-muted-foreground">
            리크루팅 일정은 News 페이지에서 확인하실 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
