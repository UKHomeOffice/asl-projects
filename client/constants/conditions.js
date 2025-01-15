import some from 'lodash/some';
import intersection from 'lodash/intersection';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';

const species = flatten(values(SPECIES));

export default {
  protocol: {
    nmbas: {
      include: false,
      type: 'condition',
      versions: [
        {
          title: 'Neuromuscular blocking agents (NMBAs)',
          content: 'All work under authority of this protocol involving the use of neuromuscular blocking agents must be carried out in accordance with the Home Office guidelines.'
        }
      ]
    },
    poles: {
      include: (protocol, project) => intersection(protocol.locations, (project.polesList || []).map(pole => pole.title)).length,
      type: 'condition',
      versions: [
        {
          title: 'POLEs',
          content: 'ASRU must be notified via [ASRUPoleNotification@homeoffice.gov.uk](mailto:ASRUPoleNotification@homeoffice.gov.uk)' +
              ' before starting any procedures at a place other than a licensed establishment (POLE) authorised under' +
              ' this licence, in order that an inspector may be present if ASRU wishes. The minimum period of notice' +
              ' to be given, the information to be provided, and the means of notification must be agreed in writing' +
              ' with ASRU at least 7 days before regulated procedures at a POLE are due to start.'
        }
      ]
    },
    reuse: {
      include: protocol => some((protocol.speciesDetails || []).filter(Boolean), species => species.reuse),
      type: 'authorisation',
      versions: [
        {
          title: 'Re-use',
          requiresEditing: true,
          content: '<<<INSERT animal type(s) HERE>>> that have been kept alive and maintained under the supervision of the NVS at <<<INSERT place HERE>>> may be re-used in this protocol, provided that all criteria in section 14 of the Animals (Scientific Procedures) Act and in this project licence are fulfilled.'
        },
        {
          title: 'Re-use',
          requiresEditing: true,
          content: '<<<INSERT animal type(s) HERE>>> that have been kept alive and maintained under the supervision of a veterinary surgeon or other suitably qualified person at <<<INSERT place HERE>>> may be re-used in this protocol, provided that all criteria in section 14 of the Animals (Scientific Procedures) Act and in this project licence are fulfilled.'
        }
      ]
    },
    'continued-use': {
      include: protocol => some((protocol.speciesDetails || []).filter(Boolean), species => species['continued-use']),
      type: 'authorisation',
      versions: [
        {
          title: 'Continued use on to a protocol',
          requiresEditing: true,
          content: '<<<INSERT animal type(s) HERE>>> used on this protocol may be obtained from protocol <<<INSERT number(s) HERE>>> of this project, or from other projects with authority to supply animals of a type authorised in this project.'
        }
      ]
    },
    'continued-use-off-protocol': {
      include: protocol => (protocol.fate || []).includes('continued-use'),
      type: 'authorisation',
      versions: [
        {
          title: 'Continued use off a protocol on to another protocol in this project',
          requiresEditing: true,
          content: '<<<INSERT animal type(s) HERE>>> may continue to be used on <<<INSERT protocol number(s) HERE>>> of this project.'
        },
        {
          title: 'Continued use off a protocol on to another protocol in this project',
          requiresEditing: true,
          content: '<<<INSERT animal type(s) HERE>>> may continue to be used on protocol <<<INSERT protocol number(s) HERE>>> of this project.'
        }
      ]
    },
    'continued-use-off-project': {
      include: protocol => (protocol.fate || []).includes('continued-use-2'),
      type: 'authorisation',
      versions: [
        {
          title: 'Continued use off protocol on to another project',
          requiresEditing: true,
          content: '<<<INSERT animal type(s) HERE>>> may continue to be used on other projects authorised to use animals of this type.'
        }
      ]
    }
  },
  project: {
    nmbas: {
      include: project => project['nmbas-used'],
      type: 'condition',
      versions: [
        {
          title: 'Neuromuscular blocking agents (NMBAs)',
          content: 'All work under authority of this licence involving the use of neuromuscular blocking agents must be carried out in accordance with the Home Office guidelines.'
        }
      ]
    },
    marmosets: {
      include: project => (project.species || []).includes('marmosets') && project['marmoset-colony'] === false,
      type: 'condition',
      versions: [
        {
          title: 'Marmosets',
          content: 'Standard condition 13(c) of this licence shall not apply in cases when marmosets sourced from a self-sustaining colony are not suitable for the purpose of the programme of work specified in the licence as justified in the project licence application.'
        },
        {
          title: 'Marmosets',
          content: 'Standard condition 13(c) of this licence shall not apply in cases when marmosets that are offspring of marmosets bred in captivity or sourced from a self-sustaining colony are not suitable for the purpose of the programme of work specified in the licence, as justified in the licence.'
        }
      ]
    },
    wild: {
      include: project => project['wild-animals'],
      type: 'condition',
      versions: [
        {
          title: 'Animals taken from the wild',
          requiresEditing: true,
          content: 'Standard condition 13(b) of this licence shall not apply in cases when <<<INSERT animal type(s) HERE>>> bred for use in procedures are not suitable for the purpose of the programme of work specified in the licence as justified in the project licence application.'
        }
      ]
    },
    feral: {
      include: project => project['feral-animals'],
      type: 'condition',
      versions: [
        {
          title: 'Feral animals',
          requiresEditing: true,
          content: 'Standard condition 13(a) of this licence shall not apply in cases when <<<INSERT animal type(s) HERE>>> bred for use in procedures are not suitable for the purpose of the programme of work specified in the licence as justified in the project licence application.'
        }
      ]
    },
    poles: {
      include: project => project.poles && project.polesList && project.polesList.length,
      type: 'condition',
      versions: [
        {
          title: 'POLEs',
          content: 'ASRU must be notified via [ASRUPoleNotification@homeoffice.gov.uk](mailto:ASRUPoleNotification@homeoffice.gov.uk)' +
              ' before starting any procedures at a place other than a licensed establishment (POLE) authorised under' +
              ' this licence, in order that an inspector may be present if ASRU wishes. The minimum period of notice' +
              ' to be given, the information to be provided, and the means of notification must be agreed in writing' +
              ' with ASRU at least 7 days before regulated procedures at a POLE are due to start.'
        }
      ]
    },
    rehoming: {
      include: project => (project['fate-of-animals'] || []).includes('rehomed'),
      type: 'authorisation',
      versions: [
        {
          title: 'Rehoming',
          requiresEditing: true,
          content: `<<<INSERT animal type(s) HERE>>> may be rehomed at the end of a series of regulated procedures provided that the following actions have been taken:
* <<<INSERT actions to ensure the state of health allows the animal to be re-homed HERE>>>;
* <<<INSERT actions to ensure that the rehoming of the animal poses no danger to public health, animal health, or the environment HERE>>>;
* <<<INSERT actions to ensure socialisation of the animal on being re-homed HERE>>>; and
* <<<INSERT any other measures to safeguard the animal's welfare on being re-homed HERE>>>.

Genetically altered animals may not be re-homed.`
        },
        {
          title: 'Rehoming',
          requiresEditing: true,
          content: `Animals may be re-homed at the end of a series of regulated procedures provided the establishment has taken action to ensure that:
* the animal's state of health allows it to be re-homed
* re-homing the animal poses no danger to public health, animal health or the environment
* the animal is socialised when it is re-homed
* the animal's welfare is safeguarded when it is re-homed

Genetically altered animals may not be re-homed.`
        }
      ]
    },
    'setting-free': {
      include: project => (project['fate-of-animals'] || []).includes('set-free'),
      type: 'authorisation',
      versions: [
        {
          title: 'Setting free',
          requiresEditing: true,
          content: `<<<INSERT animal type(s) HERE>>> may be set free at the end of the series of regulated procedures conducted under the authority of protocol <<<INSERT protocol number(s) HERE>>> provided that the following actions have been taken:
* <<<INSERT actions to ensure the state of health allows the animal to be set free HERE>>>;
* <<<INSERT actions to ensure that the setting free of the animal poses no danger to public health, animal health or the environment HERE>>>;
* <<<INSERT actions to ensure socialisation of the animal on being set free HERE>>>; and
* <<<INSERT any other measures to safeguard the animal's welfare on being set free HERE>>>`
        },
        {
          title: 'Setting free',
          requiresEditing: true,
          content: `Animals may be set free at the end of a series of regulated procedures provided the establishment has taken action to ensure that:
* the animal's state of health allows it to be set free
* setting the animal free poses no danger to public health, animal health or the environment
* the animal is socialised when it is set free, where appropriate
* the animal's welfare is safeguarded when it is set free`
        }
      ]
    },
    transfer: {
      include: project => {
        const nopes = [
          'mice',
          'rats',
          'guinea-pigs',
          'hamsters',
          // legacy
          'hamsters-syrian',
          // legacy
          'hamsters-chinese',
          'gerbils',
          'other-rodents',
          // legacy
          'xenopus',
          'common-frogs',
          'african-frogs',
          'zebra-fish'
        ];
        return (!!intersection(nopes, project.species).length || !!intersection(nopes.map(n => (species.find(s => s.value === n) || {}).label), project['species-other']).length) &&
          some(project.protocols, protocol => protocol.gaas);
      },
      type: 'authorisation',
      versions: [
        {
          title: 'Export of animals (transfer)',
          content: `Genetically altered rodents, genetically altered zebra fish and genetically altered Xenopus sp. bred and/or maintained under the authority of this project may be transferred to scientific establishments outside the United Kingdom only if:

1. The transfer will be made to a recognised scientific research establishment with a scientific requirement for genetically altered animals (or their controls) of that type; and where appropriate veterinary care can be provided as necessary; and
2. Sending tissue, gametes or embryos is not practicable or carries a higher potential welfare cost than moving live animals; and
3. Animals will be transported in accordance with all relevant regulations regarding welfare of animals in transit or the import or export of animals; and
4. Animals will be inspected by a competent person before transfer; and
5. A veterinary surgeon will confirm that he/she is not aware of any reason why these animals might suffer by virtue of the fact of being moved to another recognised scientific establishment.
6. Any transport related problems with the welfare of the animals will be notified to the Home Office promptly.`
        }
      ]
    },
    transferAndMovement: {
      include: project => project.transfer && (project['other-establishments'] || project['transferToEstablishment']),
      type: 'authorisation',
      versions: [
        {
          title: 'Transfer of animals',
          requiresEditing: true,
          content: `<<<TYPE OF ANIMAL(s)>>> may be moved from <<<NAME OF ESTABLISHMENT>>> TO <<<NAME OF ESTABLISHMENT>>> provided that:

* <<<Measures to minimise adverse effects>>>
* Animals are given a minimum of <<<7>>> days to acclimatise to their new surroundings before any further regulated procedures are undertaken
* Animals are transported in accordance with the relevant legislation
* Animals are inspected by a competent person after transfer
* Any transport related problems with the welfare of the animals are notified to the Home Office promptly`
        }
      ]
    },
    slaughter: {
      include: project => project['commercial-slaughter'],
      type: 'authorisation',
      versions: [
        {
          title: 'Commercial slaughter',
          requiresEditing: true,
          content: `<<<INSERT animal type(s) HERE>>> may be sent directly to slaughter at a registered slaughterhouse at the end of their use provided that:
* The animal is healthy and meets the commercial requirements for meat hygiene to enable them to enter the food chain. They must not be infected with any notifiable disease and comply with the relevant substance withdrawal times;
* While kept alive at pending transport to the slaughterhouse, the animal is kept in an appropriate social group under the supervision of the NVS;
* The animal is appropriately identified and is transported in accordance with the relevant legalisation.`
        },
        {
          title: 'Commercial slaughter',
          requiresEditing: true,
          content: `<<<INSERT animal type(s) HERE>>> may be sent directly to slaughter at a registered slaughterhouse at the end of their use provided that:
* The animal is healthy and meets the commercial requirements for meat hygiene to enable them to enter the food chain. They must not be infected with any notifiable disease and comply with the relevant substance withdrawal times;
* While kept alive at <<<INSERT place HERE>>> pending transport to the slaughterhouse, the animal is kept in an appropriate social group under the supervision of a veterinary surgeon;
* The animal is appropriately identified and is transported in accordance with the relevant legalisation.`
        }
      ]
    },
    continuation: {
      include: project => project['transfer-expiring'],
      type: 'authorisation',
      playback: 'expiring-yes',
      versions: [
        {
          title: 'Continuation of work',
          requiresEditing: true,
          content: 'Authority is hereby given to transfer, to this project, animals undergoing regulated procedures under the licence(s) <<<ADD LICENCE NUMBER(S) >>> (expires: <<<ADD EXPIRY DATE(S)>>>)'
        }
      ]
    },
    training: {
      // TODO: add logic regarding training
      include: () => false,
      type: 'condition',
      versions: [
        {
          title: 'Training requirement',
          requiresEditing: true,
          content: 'This licence authority will expire <<<INSERT number HERE>>> months after the initial grant date' +
              ' unless evidence that <<INSERT name HERE>>> has successfully completed accredited training module(s)' +
              ' <<<INSERT module codes HERE>>> is provided to' +
              ' [ASRUEnforcement@homeoffice.gov.uk](mailto:ASRUEnforcement@homeoffice.gov.uk).'
        }
      ]
    },
    'non-purpose-bred-sched-2': {
      include: project => {
        const triggers = [
          'mice',
          'rats',
          'guinea-pigs',
          'hamsters',
          'gerbils',
          'rabbits',
          'cats',
          'dogs',
          'ferrets',
          'fowl',
          'other-domestic-fowl',
          'other-birds',
          'common-frogs',
          'african-frogs',
          'other-amphibians',
          'zebra-fish',
          'pigs',
          'sheep'
        ];
        return triggers.some(species => (project.species || []).includes(species)) && project['purpose-bred'] === false;
      },
      type: 'condition',
      versions: [
        {
          title: 'Non purpose bred schedule 2 animals',
          content: 'Standard condition 13(d) of this licence shall not apply in cases when the relevant animals bred for use in procedures are not suitable for the purpose of the programme of work as justified in the project licence application.'
        }
      ]
    },
    'code-of-practice': {
      include: project => project['establishments-care-conditions'] === false,
      type: 'condition',
      versions: [
        {
          title: 'Establishment licences not meeting Code of Practice',
          requiresEditing: true,
          content: `If an establishment does not meet the requirements laid out in the Code of Practice for the housing and care of animals bred, supplied, or used for scientific purposes, the following conditions apply:
* <<<INSERT conditions HERE>>>`
        }
      ]
    }
  },
  inspector: {
    regtox: {
      type: 'condition',
      versions: [
        {
          title: 'Regulatory toxicology',
          content: `Where studies are requested in order to meet regulatory requirements, they will be performed in compliance with relevant UK and EU legislative bodies including the European Medicines Agency (EMA), European Chemicals Agency (ECHA), the Medicines and Healthcare Products Regulatory Agency (MHRA), Health and Safety Executive (HSE) and the Veterinary Medicines Directorate (VMD) in the UK. The guidance given in the various guidelines of the International Conference of Harmonisation (ICH) and The Organisation for Economic Co-operation and Development (OECD) are followed in the design of safety evaluation programmes and studies.

For studies requested for other worldwide authorities, for example the US Food and Drugs Administration (FDA), a scientific justification will be sought if the study requirements exceed the requirements of the UK or EU regulatory authorities for similar studies; for example by their requiring a greater number of animals or a more severe test. Permission to perform such tests will be obtained prospectively from the Secretary of State and any valid scientific justification will be included within the records of the project licence.`
        }
      ]
    },
    antibody: {
      type: 'condition',
      versions: [
        {
          title: 'Antibody production',
          content: `\
1.  You must not use living animals to produce antibodies as part of this project unless you have prior approval from the AWERB.
    
    You must request approval on a case-by-case basis for each antibody - giving a robust, legitimate scientific rationale to explain why non-animal alternatives are not suitable
      
2.  You must submit an annual project report to AWERB by 31 December each year for the duration of the project licence. The report should include the following information: 
    1.  each antibody produced using living animals 
    2.  the current state of knowledge in the relevant area of scientific research 
    3.  any validated non-animal alternatives already available 
    4.  any identically active antibodies or alternative binding or affinity reagents already available, either commercially or through other means 
    5.  why existing antibodies or reagents are unsuitable and why it’s necessary to produce an antibody using living animals 
    6.  the scientific rationale for producing each antibody using living animals, for example: 
        1. a statement that you’ve tried to use a non-animal alternative and this approach has failed, including the scientific reasons why  
        2. a statement that extrapolation of existing data strongly indicates that a non-animal antibody alternative is highly unlikely to be suitable 
        3. a statement that the target epitope does not bind to non-animal alternatives 
        4. discussion of availability and timeliness of non-animal antibody alternatives - this may be particularly relevant for therapeutic applications or where there is a scientific urgency (for example, global infectious disease pandemics where there is a need for a new diagnostic)
        
        Note: The regulator will not accept cost or convenience as reasons why you haven’t developed or used non-animal alternatives to produce antibodies (or used a third party) 
    7.  the animal models and numbers, antigen(s) and methods you’ve used during this project 
    8.  any specific problems you’ve addressed 
    9.  how the antibody will be used 
    10. who or what is likely to benefit - and how - in the short, medium and longer term 
    11. why the adjuvants, techniques and administration routes you’ve used are the most appropriate and refined 
    12. how you’re keeping up to date with advances in the 3Rs, and implementing these advances effectively 
    13. how you’ve used 3Rs learnings from previous projects 
    14. how you’ll refine the procedures to minimise potential harm to animals 
    
3. You must share any project reports and AWERB review outcomes with ASRU when requested 
`
        }
      ]
    },
    reporting: {
      type: 'condition',
      versions: [
        {
          title: 'Reporting requirement',
          requiresEditing: true,
          content: 'A report in writing to [ASRUEnforcement@homeoffice.gov.uk](mailto:ASRUEnforcement@homeoffice.gov.uk)' +
              ' on the project shall be made by <<<INSERT date HERE>>> or after <<<INSERT number HERE>>> animals have' +
              ' been used, whichever is the sooner. The report shall contain <<<INSERT required content of report HERE>>>.'
        }
      ]
    },
    inspection: {
      type: 'condition',
      versions: [
        {
          title: 'Inspection requirement',
          content: 'The licence holder shall ensure that ASRU is notified via' +
              ' [ASRUEnforcement@homeoffice.gov.uk](mailto:ASRUEnforcement@homeoffice.gov.uk) before regulated' +
              ' procedures are applied at any place specified in this licence to enable an inspector to be present if' +
              ' ASRU wishes. The minimum periods of notice to be given, the information to be provided, and the means' +
              ' of notification shall be agreed in writing with ASRU at least 7 days before commencement of regulated' +
              ' procedures in this project.'
        }
      ]
    },
    'batch-testing': {
      type: 'condition',
      versions: [
        {
          title: 'Batch testing',
          content: 'For all batch quality control testing using live animals, the substance or product to be tested must be named in the licence providing scientific justification for such a test. You must notify the Home Office when an alternative non-animal test for a substance or product becomes validated and accepted in order that the authorisation for the ongoing use of the live animal test can be withdrawn for the particular substance or product.'
        }
      ]
    },
    'testing-household-products': {
      type: 'condition',
      versions: [
        {
          title: 'Testing household products',
          content: `The following conditions apply to the testing of finished household products or their ingredients:
* The use of animals in testing finished household products under this licence is prohibited;
* The testing of substances under this licence is prohibited where more than fifty per cent of the substance is intended or expected, at the time of testing, to be used as an ingredient in a household product unless there is a regulatory requirement under national or international legislation for testing which is authorised by a project licence or a non-regulatory requirement which is specifically authorised by the Secretary of State;
* If testing is carried out for a regulatory purpose, the licence holder must notify the Home Office of all such testing within 30 days of the first animal test, using the form of notification required by the Secretary of State;
* If testing of a substance is proposed under this licence where more than fifty per cent of the substance is intended or expected, at the time of testing, to be used as an ingredient in a household product and the testing is not for a regulatory purpose, the licence holder must apply for prospective authorisation to carry out such testing which, if granted, will be specific to the substance and purpose for which the application is made.`
        }
      ]
    },
    'minimise-suffering-wild-feral': {
      type: 'condition',
      versions: [
        {
          title: 'Minimising suffering for wild or feral animals',
          requiresEditing: true,
          content: 'In accordance with paragraph 25(5) of Schedule 2C to the Act, the words “...and, unless the Secretary of State has agreed otherwise, action has been taken to minimise the suffering of the animal” in part (b) of Standard Condition 14 (b) of this licence shall not apply to wild <<<INSERT animal type(s) HERE>>> or feral <<<INSERT animal type(s) HERE>>> undergoing procedures under protocol <<<INSERT protocol number(s) HERE>>> of the licence for the purpose of the programme of work specified and justified in the licence.'
        }
      ]
    },
    cosmetics: {
      type: 'condition',
      versions: [
        {
          title: 'Cosmetic use',
          content: 'The use of animals to test chemicals or pharmaceuticals that have exclusive use as ingredients for cosmetics is prohibited. Prospective authority will be sought for the testing on animals of substances that may also be used as ingredients for cosmetics.'
        }
      ]
    }
  }
};
